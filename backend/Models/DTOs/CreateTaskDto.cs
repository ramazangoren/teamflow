public record CreateTaskDto(
    string ProjectId,
    string Title,
    string StatusId,
    int Priority,
    string? AssigneeId,
    DateTime? DueDate
);
