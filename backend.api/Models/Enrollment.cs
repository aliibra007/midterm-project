namespace backend.api.Models;

// junction table — one row per student/class pair
public class Enrollment
{
    public int Id { get; set; }

    public int ClassId { get; set; }
    public Class Class { get; set; } = null!;

    public int StudentId { get; set; }
    public Student Student { get; set; } = null!;

    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
}
