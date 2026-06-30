namespace backend.api.DTOs;

public class StudentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Major { get; set; } = string.Empty;
    public List<EnrolledClassDto> Classes { get; set; } = [];
}
