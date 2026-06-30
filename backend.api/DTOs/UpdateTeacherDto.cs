using System.ComponentModel.DataAnnotations;

namespace backend.api.DTOs;

public class UpdateTeacherDto
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MinLength(6), MaxLength(100)]
    public string? Password { get; set; }
}
