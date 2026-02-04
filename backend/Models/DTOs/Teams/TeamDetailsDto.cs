// DTOs/Teams/TeamDetailsDto.cs
namespace Backend.DTOs.Teams;

public class TeamDetailsDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<TeamMemberDto> Members { get; set; } = new();
    public int ProjectCount { get; set; }
    public int TaskCount { get; set; }
}

public class TeamMemberDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public DateTime JoinedAt { get; set; }
}