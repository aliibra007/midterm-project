using System.Text;
using backend.api.Data;
using backend.api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

// Npgsql requires this so DateTime values are stored/read without timezone confusion
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// Railway (and most PaaS hosts) inject a PORT environment variable — bind to it
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port))
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ── Database ──────────────────────────────────────────────────────────────────
// Render injects individual PG* vars — build a proper Npgsql key=value string from them.
// Falls back to appsettings.json for local dev.
var pgHost = Environment.GetEnvironmentVariable("PGHOST");
var connStr = !string.IsNullOrEmpty(pgHost)
    ? $"Host={pgHost};" +
      $"Port={Environment.GetEnvironmentVariable("PGPORT") ?? "5432"};" +
      $"Database={Environment.GetEnvironmentVariable("PGDATABASE")};" +
      $"Username={Environment.GetEnvironmentVariable("PGUSER")};" +
      $"Password={Environment.GetEnvironmentVariable("PGPASSWORD")};" +
      $"SSL Mode=Require;Trust Server Certificate=true"
    : builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connStr));

// ── JWT Authentication ────────────────────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidAudience            = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew                = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// ── App Services ──────────────────────────────────────────────────────────────
builder.Services.AddScoped<JwtService>();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Set ALLOWED_ORIGIN env var on Render to your Vercel URL.
// Falls back to localhost for local dev.
var allowedOrigin = Environment.GetEnvironmentVariable("ALLOWED_ORIGIN")
    ?? "http://localhost:5173";

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(allowedOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ── MVC + Swagger ─────────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ── Migrate + seed default admin ─────────────────────────────────────────────
try
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // applies any pending migrations automatically on Render
    if (!db.Admins.Any())
    {
        db.Admins.Add(new backend.api.Models.Admin
        {
            Name         = "Admin",
            Email        = "admin@school.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123456")
        });
        db.SaveChanges();
    }
}
catch (Exception ex)
{
    // Log but don't crash — the app can still start even if seed fails
    Console.WriteLine($"[Startup] DB seed failed: {ex.Message}");
}

// ── Dev tools ─────────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseHttpsRedirection(); // Railway handles HTTPS at the proxy — only redirect locally
}

// ── Middleware pipeline ───────────────────────────────────────────────────────
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
