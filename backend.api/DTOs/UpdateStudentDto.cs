using System.ComponentModel.DataAnnotations;

namespace backend.api.DTOs;

public class UpdateStudentDto
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(100)]
    public string? Major { get; set; }

    // only set this if the student wants to change their password
    [MinLength(6), MaxLength(100)]
    public string? Password { get; set; }
}
