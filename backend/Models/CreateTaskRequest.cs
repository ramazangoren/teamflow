namespace Backend.Models;

public class CreateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public string StatusId { get; set; } = string.Empty;

    public int Priority { get; set; } = 3;
    public string? AssigneeId { get; set; }
    public DateTime? DueDate { get; set; }
}
