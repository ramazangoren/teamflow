public class AuthResponse
{
    public long UserId { get; set; }
    public string Email { get; set; } = null!;
    public string? FullName { get; set; }
    public string Token { get; set; } = null!;
}