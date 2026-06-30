namespace backend.api.DTOs;

public class TeacherDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public List<ClassSummaryDto> Classes { get; set; } = [];
}
