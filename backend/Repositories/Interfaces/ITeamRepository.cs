using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface ITeamRepository
{
    Task CreateWithOwnerAsync(Team team, string ownerId);
    Task<IEnumerable<Team>> GetByUserIdAsync(string userId);
}
