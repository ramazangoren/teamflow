namespace Backend.Models;

public class Notes
{
    public int Id { get; set; }

    public string Title { get; set; } 
    public string Content { get; set; } 
    public string Folder { get; set; }

    public bool IsPinned { get; set; }
    public bool IsArchived { get; set; }
    public bool IsDeleted { get; set; }
    public bool CompletelyDeleted { get; set; }
    public string? Tags { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

