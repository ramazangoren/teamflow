using Backend.DTOs.Teams;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class TeamService : ITeamService
{
    private readonly ITeamRepository _teams;

    public TeamService(ITeamRepository teams)
    {
        _teams = teams;
    }

    public async Task<Team> CreateAsync(CreateTeamDto dto, string ownerId)
    {
        var team = new Team
        {
            Id = Guid.NewGuid().ToString(),
            Name = dto.Name
        };

        await _teams.CreateWithOwnerAsync(team, ownerId);
        return team;
    }

    public Task<IEnumerable<Team>> GetForUserAsync(string userId)
        => _teams.GetByUserIdAsync(userId);
}
