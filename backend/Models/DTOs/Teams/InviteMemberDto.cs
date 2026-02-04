// DTOs/Teams/InviteMemberDto.cs
namespace Backend.DTOs.Teams;

public class InviteMemberDto
{
    public string Email { get; set; } = null!;
    public string Role { get; set; } = "Member";
}