using System.Security.Claims;
using backend.api.Data;
using backend.api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // every endpoint here requires a valid JWT
public class StudentController : ControllerBase
{
    private readonly AppDbContext _db;

    public StudentController(AppDbContext db)
    {
        _db = db;
    }

    // pull user identity from the JWT claims
    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // GET /api/student — teachers only: list every student (no class detail)
    [HttpGet]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GetAll()
    {
        var students = await _db.Students
            .Select(s => new StudentDto
            {
                Id = s.Id,
                Name = s.Name,
                Email = s.Email,
                Major = s.Major,
                Classes = new List<EnrolledClassDto>()
            })
            .ToListAsync();

        return Ok(students);
    }

    // GET /api/student/me — logged-in student sees their own profile + enrolled classes
    [HttpGet("me")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetMe()
    {
        var userId = GetUserId();
        var student = await _db.Students
            .Include(s => s.Enrollments)
                .ThenInclude(e => e.Class)
                .ThenInclude(c => c.Teacher)
            .FirstOrDefaultAsync(s => s.Id == userId);

        if (student == null) return NotFound();

        return Ok(new StudentDto
        {
            Id = student.Id,
            Name = student.Name,
            Email = student.Email,
            Major = student.Major,
            Classes = student.Enrollments.Select(e => new EnrolledClassDto
            {
                Id = e.Class.Id,
                Name = e.Class.Name,
                Schedule = e.Class.Schedule,
                TeacherName = e.Class.Teacher.Name
            }).ToList()
        });
    }

    // GET /api/student/{id} — teachers only: look up one student with their class list
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GetById(int id)
    {
        var student = await _db.Students
            .Include(s => s.Enrollments)
                .ThenInclude(e => e.Class)
                .ThenInclude(c => c.Teacher)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null) return NotFound();

        return Ok(new StudentDto
        {
            Id = student.Id,
            Name = student.Name,
            Email = student.Email,
            Major = student.Major,
            Classes = student.Enrollments.Select(e => new EnrolledClassDto
            {
                Id = e.Class.Id,
                Name = e.Class.Name,
                Schedule = e.Class.Schedule,
                TeacherName = e.Class.Teacher.Name
            }).ToList()
        });
    }

    // PUT /api/student/me — student updates their own name, major, or password
    [HttpPut("me")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateStudentDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var student = await _db.Students.FindAsync(GetUserId());
        if (student == null) return NotFound();

        if (dto.Name != null) student.Name = dto.Name;
        if (dto.Major != null) student.Major = dto.Major;
        if (dto.Password != null)
            student.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/student/{id} — teachers only: remove a student account entirely
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Delete(int id)
    {
        var student = await _db.Students.FindAsync(id);
        if (student == null) return NotFound();

        _db.Students.Remove(student);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
