namespace backend.api.DTOs;

// compact student info used inside ClassDto when listing who's enrolled
public class StudentSummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Major { get; set; } = string.Empty;
}
