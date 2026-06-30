namespace backend.api.DTOs;

// lightweight class info — no student list
// used in tables and lists where you just need the overview
public class ClassSummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime Schedule { get; set; }
    public int MaxStudents { get; set; }
    public int CurrentStudentCount { get; set; }
}
