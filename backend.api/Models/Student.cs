using System.ComponentModel.DataAnnotations;

namespace backend.api.Models;

public class Student
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    // never store plain text — always BCrypt hashed before saving
    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Major { get; set; } = "Computer Science";

    // classes this student is enrolled in (via junction table)
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
