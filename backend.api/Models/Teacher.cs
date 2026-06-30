using System.ComponentModel.DataAnnotations;

namespace backend.api.Models;

public class Teacher
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    // all classes this teacher is responsible for
    public ICollection<Class> Classes { get; set; } = [];
}
