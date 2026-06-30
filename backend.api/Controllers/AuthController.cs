using backend.api.Data;
using backend.api.DTOs;
using backend.api.Models;
using backend.api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtService _jwt;

    public AuthController(AppDbContext db, JwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    // POST /api/auth/login
    // checks students first, then teachers — returns JWT on success
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var student = await _db.Students.FirstOrDefaultAsync(s => s.Email == dto.Email);
        if (student != null && BCrypt.Net.BCrypt.Verify(dto.Password, student.PasswordHash))
        {
            var token = _jwt.GenerateToken(student.Id, student.Email, "Student");
            return Ok(new AuthResponseDto
            {
                Token = token,
                Role = "Student",
                UserId = student.Id,
                Name = student.Name,
                Email = student.Email
            });
        }

        var teacher = await _db.Teachers.FirstOrDefaultAsync(t => t.Email == dto.Email);
        if (teacher != null && BCrypt.Net.BCrypt.Verify(dto.Password, teacher.PasswordHash))
        {
            var token = _jwt.GenerateToken(teacher.Id, teacher.Email, "Teacher");
            return Ok(new AuthResponseDto
            {
                Token = token,
                Role = "Teacher",
                UserId = teacher.Id,
                Name = teacher.Name,
                Email = teacher.Email
            });
        }

        // check admins last
        var admin = await _db.Admins.FirstOrDefaultAsync(a => a.Email == dto.Email);
        if (admin != null && BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash))
        {
            var token = _jwt.GenerateToken(admin.Id, admin.Email, "Admin");
            return Ok(new AuthResponseDto
            {
                Token = token,
                Role = "Admin",
                UserId = admin.Id,
                Name = admin.Name,
                Email = admin.Email
            });
        }

        // intentionally vague — don't reveal which part was wrong
        return Unauthorized(new { message = "Invalid email or password" });
    }

    // POST /api/auth/register/student
    [HttpPost("register/student")]
    public async Task<IActionResult> RegisterStudent([FromBody] RegisterStudentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // block the email if it's already used by any role
        if (await _db.Students.AnyAsync(s => s.Email == dto.Email) ||
            await _db.Teachers.AnyAsync(t => t.Email == dto.Email))
            return Conflict(new { message = "Email already in use" });

        var student = new Student
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Major = dto.Major
        };

        _db.Students.Add(student);
        await _db.SaveChangesAsync();

        var token = _jwt.GenerateToken(student.Id, student.Email, "Student");
        return Created($"/api/student/{student.Id}", new AuthResponseDto
        {
            Token = token,
            Role = "Student",
            UserId = student.Id,
            Name = student.Name,
            Email = student.Email
        });
    }

    // POST /api/auth/register/teacher
    [HttpPost("register/teacher")]
    public async Task<IActionResult> RegisterTeacher([FromBody] RegisterTeacherDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (await _db.Teachers.AnyAsync(t => t.Email == dto.Email) ||
            await _db.Students.AnyAsync(s => s.Email == dto.Email))
            return Conflict(new { message = "Email already in use" });

        var teacher = new Teacher
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _db.Teachers.Add(teacher);
        await _db.SaveChangesAsync();

        var token = _jwt.GenerateToken(teacher.Id, teacher.Email, "Teacher");
        return Created($"/api/teacher/{teacher.Id}", new AuthResponseDto
        {
            Token = token,
            Role = "Teacher",
            UserId = teacher.Id,
            Name = teacher.Name,
            Email = teacher.Email
        });
    }
}
