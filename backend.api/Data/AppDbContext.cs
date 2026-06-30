using backend.api.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Student> Students => Set<Student>();
    public DbSet<Teacher> Teachers => Set<Teacher>();
    public DbSet<Class> Classes => Set<Class>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<Admin> Admins => Set<Admin>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // each email must be unique within its role table
        modelBuilder.Entity<Student>().HasIndex(s => s.Email).IsUnique();
        modelBuilder.Entity<Teacher>().HasIndex(t => t.Email).IsUnique();
        modelBuilder.Entity<Admin>().HasIndex(a => a.Email).IsUnique();

        // prevent double-enrollment — same student can't appear twice in the same class
        modelBuilder.Entity<Enrollment>()
            .HasIndex(e => new { e.ClassId, e.StudentId })
            .IsUnique();

        // one teacher → many classes; deleting the teacher removes their classes
        modelBuilder.Entity<Class>()
            .HasOne(c => c.Teacher)
            .WithMany(t => t.Classes)
            .HasForeignKey(c => c.TeacherId)
            .OnDelete(DeleteBehavior.Cascade);

        // deleting a class removes all enrollment rows for it
        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.Class)
            .WithMany(c => c.Enrollments)
            .HasForeignKey(e => e.ClassId)
            .OnDelete(DeleteBehavior.Cascade);

        // deleting a student removes all their enrollments
        modelBuilder.Entity<Enrollment>()
            .HasOne(e => e.Student)
            .WithMany(s => s.Enrollments)
            .HasForeignKey(e => e.StudentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
