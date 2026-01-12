namespace Backend.Repositories;

using Backend.Models.Entities;

public interface IFavRepository
{
    Task<long> CreateAsync(long userId, long clothingItemId);
    Task<IEnumerable<ClothingItem>> GetByUserAsync(long userId);
    Task<bool> DeleteAsync(long clothingItemId, long userId);
    Task<bool> ExistsAsync(long userId, long clothingItemId);
}