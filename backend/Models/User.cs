namespace Backend.Models;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string? FullName { get; set; }
    public bool IsActive { get; set; }
    public string Role { get; set; } = "Member";
    public DateTime CreatedAt { get; set; }
}

