using backend.api.Data;
using backend.api.DTOs;
using backend.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")] // every single endpoint here is admin-only
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    // ── Stats ─────────────────────────────────────────────────────────────────

    // GET /api/admin/stats — dashboard numbers
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var studentCount = await _db.Students.CountAsync();
        var teacherCount = await _db.Teachers.CountAsync();
        var classCount   = await _db.Classes.CountAsync();

        return Ok(new { studentCount, teacherCount, classCount });
    }

    // ── Students ──────────────────────────────────────────────────────────────

    // GET /api/admin/students — list every student
    [HttpGet("students")]
    public async Task<IActionResult> GetStudents()
    {
        var students = await _db.Students
            .Select(s => new StudentDto
            {
                Id    = s.Id,
                Name  = s.Name,
                Email = s.Email,
                Major = s.Major,
                Classes = new List<EnrolledClassDto>()
            })
            .ToListAsync();
        return Ok(students);
    }

    // POST /api/admin/students — admin creates a student account
    [HttpPost("students")]
    public async Task<IActionResult> CreateStudent([FromBody] RegisterStudentDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (await _db.Students.AnyAsync(s => s.Email == dto.Email) ||
            await _db.Teachers.AnyAsync(t => t.Email == dto.Email) ||
            await _db.Admins.AnyAsync(a => a.Email == dto.Email))
            return Conflict(new { message = "Email already in use" });

        var student = new Student
        {
            Name         = dto.Name,
            Email        = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Major        = dto.Major
        };

        _db.Students.Add(student);
        await _db.SaveChangesAsync();
        return Created($"/api/student/{student.Id}", new { student.Id, student.Name, student.Email, student.Major });
    }

    // DELETE /api/admin/students/{id} — admin removes a student
    [HttpDelete("students/{id:int}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var student = await _db.Students.FindAsync(id);
        if (student == null) return NotFound();

        _db.Students.Remove(student);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // ── Teachers ──────────────────────────────────────────────────────────────

    // GET /api/admin/teachers — list every teacher
    [HttpGet("teachers")]
    public async Task<IActionResult> GetTeachers()
    {
        var teachers = await _db.Teachers
            .Include(t => t.Classes)
            .Select(t => new TeacherDto
            {
                Id      = t.Id,
                Name    = t.Name,
                Email   = t.Email,
                Classes = new List<ClassSummaryDto>()
            })
            .ToListAsync();
        return Ok(teachers);
    }

    // POST /api/admin/teachers — admin creates a teacher account
    [HttpPost("teachers")]
    public async Task<IActionResult> CreateTeacher([FromBody] RegisterTeacherDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        if (await _db.Teachers.AnyAsync(t => t.Email == dto.Email) ||
            await _db.Students.AnyAsync(s => s.Email == dto.Email) ||
            await _db.Admins.AnyAsync(a => a.Email == dto.Email))
            return Conflict(new { message = "Email already in use" });

        var teacher = new Teacher
        {
            Name         = dto.Name,
            Email        = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _db.Teachers.Add(teacher);
        await _db.SaveChangesAsync();
        return Created($"/api/teacher/{teacher.Id}", new { teacher.Id, teacher.Name, teacher.Email });
    }

    // DELETE /api/admin/teachers/{id} — admin removes a teacher and all their classes
    [HttpDelete("teachers/{id:int}")]
    public async Task<IActionResult> DeleteTeacher(int id)
    {
        var teacher = await _db.Teachers.FindAsync(id);
        if (teacher == null) return NotFound();

        _db.Teachers.Remove(teacher);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
