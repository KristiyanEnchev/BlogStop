namespace Application.Interfaces
{
    using System.Threading.Tasks;
    using System.Collections.Generic;

    using Models.Blog;

    public interface ICategoryService
    {
        Task<IReadOnlyList<CategoryDto>> GetAllCategoriesAsync();
        Task<CategoryDto?> GetCategoryByIdAsync(string categoryId);
        Task<CategoryDto> CreateCategoryAsync(string name, string description);
        Task<bool> UpdateCategoryAsync(string categoryId, string name, string description);
        Task<bool> DeleteCategoryAsync(string categoryId);
    }
}
