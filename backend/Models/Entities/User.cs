public class User
{
    public long Id { get; set; }
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;
    public string? FullName { get; set; }

    public DateTime CreatedAt { get; set; }
}
