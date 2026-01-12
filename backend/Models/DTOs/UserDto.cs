using System.ComponentModel.DataAnnotations.Schema;

public class UserDto
{
    public int Id { get; set; }

    [Column("FullName")]
    public string FullName { get; set; }
    public string Email { get; set; }
    public string? Gender { get; set; }
    public string? DateOfBirth { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}