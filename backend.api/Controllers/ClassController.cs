using System.Security.Claims;
using backend.api.Data;
using backend.api.DTOs;
using backend.api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClassController : ControllerBase
{
    private readonly AppDbContext _db;

    public ClassController(AppDbContext db)
    {
        _db = db;
    }

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private string GetRole() => User.FindFirstValue(ClaimTypes.Role)!;

    // GET /api/class — all classes as a light summary (no student roster)
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var classes = await _db.Classes
            .Include(c => c.Enrollments)
            .Select(c => new ClassSummaryDto
            {
                Id = c.Id,
                Name = c.Name,
                Schedule = c.Schedule,
                MaxStudents = c.MaxStudents,
                CurrentStudentCount = c.Enrollments.Count
            })
            .ToListAsync();

        return Ok(classes);
    }

    // GET /api/class/my — classes that belong to the current user
    //   teacher → classes they own
    //   student → classes they're enrolled in
    [HttpGet("my")]
    public async Task<IActionResult> GetMy()
    {
        var userId = GetUserId();
        var role = GetRole();

        if (role == "Teacher")
        {
            var classes = await _db.Classes
                .Include(c => c.Enrollments)
                .Where(c => c.TeacherId == userId)
                .Select(c => new ClassSummaryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Schedule = c.Schedule,
                    MaxStudents = c.MaxStudents,
                    CurrentStudentCount = c.Enrollments.Count
                })
                .ToListAsync();
            return Ok(classes);
        }
        else
        {
            var classes = await _db.Enrollments
                .Include(e => e.Class).ThenInclude(c => c.Teacher)
                .Where(e => e.StudentId == userId)
                .Select(e => new EnrolledClassDto
                {
                    Id = e.Class.Id,
                    Name = e.Class.Name,
                    Schedule = e.Class.Schedule,
                    TeacherName = e.Class.Teacher.Name
                })
                .ToListAsync();
            return Ok(classes);
        }
    }

    // GET /api/class/{id} — full class with student roster
    //   teachers see any class; students can only see classes they're enrolled in
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cls = await _db.Classes
            .Include(c => c.Teacher)
            .Include(c => c.Enrollments).ThenInclude(e => e.Student)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (cls == null) return NotFound();

        // students can only peek inside classes they already belong to
        if (GetRole() == "Student")
        {
            var userId = GetUserId();
            if (!cls.Enrollments.Any(e => e.StudentId == userId))
                return Forbid();
        }

        return Ok(new ClassDto
        {
            Id = cls.Id,
            Name = cls.Name,
            Schedule = cls.Schedule,
            MaxStudents = cls.MaxStudents,
            CurrentStudentCount = cls.Enrollments.Count,
            TeacherId = cls.TeacherId,
            TeacherName = cls.Teacher.Name,
            Students = cls.Enrollments.Select(e => new StudentSummaryDto
            {
                Id = e.Student.Id,
                Name = e.Student.Name,
                Email = e.Student.Email,
                Major = e.Student.Major
            }).ToList()
        });
    }

    // POST /api/class — teacher creates a new class (auto-assigned to themselves)
    [HttpPost]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Create([FromBody] CreateClassDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var cls = new Class
        {
            Name = dto.Name,
            Schedule = dto.Schedule,
            MaxStudents = dto.MaxStudents,
            TeacherId = GetUserId()
        };

        _db.Classes.Add(cls);
        await _db.SaveChangesAsync();

        return Created($"/api/class/{cls.Id}", new { cls.Id, cls.Name, cls.Schedule, cls.MaxStudents, cls.TeacherId });
    }

    // PUT /api/class/{id} — teacher updates one of their own classes
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateClassDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var cls = await _db.Classes.FindAsync(id);
        if (cls == null) return NotFound();
        if (cls.TeacherId != GetUserId()) return Forbid(); // can't edit another teacher's class

        if (dto.Name != null) cls.Name = dto.Name;
        if (dto.Schedule.HasValue) cls.Schedule = dto.Schedule.Value;
        if (dto.MaxStudents.HasValue) cls.MaxStudents = dto.MaxStudents.Value;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/class/{id} — teacher deletes one of their own classes
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> Delete(int id)
    {
        var cls = await _db.Classes.FindAsync(id);
        if (cls == null) return NotFound();
        if (cls.TeacherId != GetUserId()) return Forbid();

        _db.Classes.Remove(cls);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // POST /api/class/{id}/enroll — student self-enrolls in a class
    [HttpPost("{id:int}/enroll")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> Enroll(int id)
    {
        var studentId = GetUserId();
        var cls = await _db.Classes
            .Include(c => c.Enrollments)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (cls == null) return NotFound();
        if (cls.Enrollments.Any(e => e.StudentId == studentId))
            return Conflict(new { message = "Already enrolled in this class" });
        if (cls.MaxStudents > 0 && cls.Enrollments.Count >= cls.MaxStudents)
            return BadRequest(new { message = "Class is full" });

        _db.Enrollments.Add(new Enrollment { ClassId = id, StudentId = studentId });
        await _db.SaveChangesAsync();
        return Ok(new { message = "Enrolled successfully" });
    }

    // DELETE /api/class/{classId}/remove/{studentId} — teacher removes a student from their class
    [HttpDelete("{classId:int}/remove/{studentId:int}")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> RemoveStudent(int classId, int studentId)
    {
        var cls = await _db.Classes.FindAsync(classId);
        if (cls == null) return NotFound();
        if (cls.TeacherId != GetUserId()) return Forbid(); // only the class owner can remove students

        var enrollment = await _db.Enrollments
            .FirstOrDefaultAsync(e => e.ClassId == classId && e.StudentId == studentId);

        if (enrollment == null) return NotFound(new { message = "Student is not enrolled in this class" });

        _db.Enrollments.Remove(enrollment);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Student removed from class" });
    }

    // GET /api/class/{classId}/students — teacher views the full student roster for one of their classes
    [HttpGet("{classId:int}/students")]
    [Authorize(Roles = "Teacher")]
    public async Task<IActionResult> GetStudents(int classId)
    {
        var cls = await _db.Classes.FindAsync(classId);
        if (cls == null) return NotFound();
        if (cls.TeacherId != GetUserId()) return Forbid();

        var students = await _db.Enrollments
            .Include(e => e.Student)
            .Where(e => e.ClassId == classId)
            .Select(e => new StudentSummaryDto
            {
                Id = e.Student.Id,
                Name = e.Student.Name,
                Email = e.Student.Email,
                Major = e.Student.Major
            })
            .ToListAsync();

        return Ok(students);
    }
}
