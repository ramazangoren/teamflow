namespace Backend.Repositories;

using Backend.Models.Entities;

public interface IClothingRepository
{
    Task<long> CreateAsync(ClothingItem item);
    Task<bool> UpdateAsync(ClothingItem item);
    Task<IEnumerable<ClothingItem>> GetByUserAsync(long userId);
    Task<bool> DeleteAsync(long id, long userId);
}
