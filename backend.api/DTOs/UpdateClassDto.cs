using System.ComponentModel.DataAnnotations;

namespace backend.api.DTOs;

// all fields are optional — only what's sent gets updated (PATCH-style via PUT)
public class UpdateClassDto
{
    [MaxLength(200)]
    public string? Name { get; set; }

    public DateTime? Schedule { get; set; }

    [Range(0, 1000)]
    public int? MaxStudents { get; set; }
}
