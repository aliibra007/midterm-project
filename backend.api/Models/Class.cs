using System.ComponentModel.DataAnnotations;

namespace backend.api.Models;

public class Class
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    // day and time the class meets — stored as UTC
    public DateTime Schedule { get; set; }

    // 0 means no hard cap on enrollment
    public int MaxStudents { get; set; } = 0;

    public int TeacherId { get; set; }
    public Teacher Teacher { get; set; } = null!;

    public ICollection<Enrollment> Enrollments { get; set; } = [];
}
