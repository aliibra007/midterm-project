namespace backend.api.DTOs;

// full class details including the list of enrolled students
// used when a teacher opens a specific class to manage it
public class ClassDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Schedule { get; set; }
    public int MaxStudents { get; set; }
    public int CurrentStudentCount { get; set; }
    public int TeacherId { get; set; }
    public string TeacherName { get; set; } = string.Empty;
    public List<StudentSummaryDto> Students { get; set; } = [];
}
