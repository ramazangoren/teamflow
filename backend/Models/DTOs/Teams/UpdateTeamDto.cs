// DTOs/Teams/UpdateTeamDto.cs
namespace Backend.DTOs.Teams;

public class UpdateTeamDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? AvatarUrl { get; set; }
}