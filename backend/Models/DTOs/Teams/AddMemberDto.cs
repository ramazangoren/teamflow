// DTOs/Teams/AddMemberDto.cs
namespace Backend.DTOs.Teams;

public class AddMemberDto
{
    public string Email { get; set; } = null!;
    public string Role { get; set; } = "Member"; // Member, Admin, Owner
}