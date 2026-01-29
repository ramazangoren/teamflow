using Backend.DTOs.Teams;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface ITeamService
{
    Task<Team> CreateAsync(CreateTeamDto dto, string ownerId);
    Task<IEnumerable<Team>> GetForUserAsync(string userId);
}
