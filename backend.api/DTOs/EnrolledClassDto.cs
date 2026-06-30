namespace backend.api.DTOs;

// what a student sees when listing their enrolled classes
public class EnrolledClassDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Schedule { get; set; }
    public string TeacherName { get; set; } = string.Empty;
}
