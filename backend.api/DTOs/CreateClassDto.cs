using System.ComponentModel.DataAnnotations;

namespace backend.api.DTOs;

public class CreateClassDto
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public DateTime Schedule { get; set; }

    // 0 = unlimited seats
    [Range(0, 1000)]
    public int MaxStudents { get; set; } = 0;
}
