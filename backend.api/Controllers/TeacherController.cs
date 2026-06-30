using System.Security.Claims;
using backend.api.Data;
using backend.api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TeacherController : ControllerBase
{
    private readonly AppDbContext _db;

    public TeacherController(AppDbContext db)
    {
        _db = db;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET /api/teacher — any authenticated user can list teachers
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var teachers = await _db.Teachers
            .Include(t => t.Classes)
                .ThenInclude(c => c.Enrollments)
            .Select(t => new TeacherDto
            {
                Id = t.Id,
                Name = t.Name,
                Email = t.Email,
                Classes = t.Classes.Select(c => new ClassSummaryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Schedule = c.Schedule,
                    MaxStudents = c.MaxStudents,
                    CurrentStudentCount = c.Enrollments.Count
                }).ToList()
            })
            .ToListAsync();

        return Ok(teachers);
    }

    // GET /api/teacher/me — teacher sees their own profile with all classes
    [HttpGet("me")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GetMe()
    {
        var teacherId = GetUserId();
        var teacher = await _db.Teachers
            .Include(t => t.Classes)
                .ThenInclude(c => c.Enrollments)
            .FirstOrDefaultAsync(t => t.Id == teacherId);

        if (teacher == null) return NotFound();

        return Ok(new TeacherDto
        {
            Id = teacher.Id,
            Name = teacher.Name,
            Email = teacher.Email,
            Classes = teacher.Classes.Select(c => new ClassSummaryDto
            {
                Id = c.Id,
                Name = c.Name,
                Schedule = c.Schedule,
                MaxStudents = c.MaxStudents,
                CurrentStudentCount = c.Enrollments.Count
            }).ToList()
        });
    }

    // GET /api/teacher/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var teacher = await _db.Teachers
            .Include(t => t.Classes)
                .ThenInclude(c => c.Enrollments)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (teacher == null) return NotFound();

        return Ok(new TeacherDto
        {
            Id = teacher.Id,
            Name = teacher.Name,
            Email = teacher.Email,
            Classes = teacher.Classes.Select(c => new ClassSummaryDto
            {
                Id = c.Id,
                Name = c.Name,
                Schedule = c.Schedule,
                MaxStudents = c.MaxStudents,
                CurrentStudentCount = c.Enrollments.Count
            }).ToList()
        });
    }

    // PUT /api/teacher/me — teacher updates their name or password
    [HttpPut("me")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateTeacherDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var teacher = await _db.Teachers.FindAsync(GetUserId());
        if (teacher == null) return NotFound();

        if (dto.Name != null) teacher.Name = dto.Name;
        if (dto.Password != null)
            teacher.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        await _db.SaveChangesAsync();
        return NoContent();
    }
}
