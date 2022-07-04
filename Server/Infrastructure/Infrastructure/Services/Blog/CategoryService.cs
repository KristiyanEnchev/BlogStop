namespace Infrastructure.Services.Blog
{
    using Microsoft.EntityFrameworkCore;

    using Mapster;

    using Domain.Entities.Blog;

    using Models.Blog;

    using Shared.Interfaces;

    public class CategoryService
    {
        private readonly IRepository<Category> _categoryRepository;

        public CategoryService(IRepository<Category> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IReadOnlyList<CategoryDto>> GetAllCategoriesAsync()
        {
            return await _categoryRepository.AsNoTracking()
                .ProjectToType<CategoryDto>()
                .ToListAsync();
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(string categoryId)
        {
            return await _categoryRepository.AsNoTracking()
                .Where(c => c.Id == categoryId)
                .ProjectToType<CategoryDto>()
                .FirstOrDefaultAsync();
        }

        public async Task<CategoryDto> CreateCategoryAsync(string name, string description)
        {
            var newCategory = new Category
            {
                Name = name,
                Slug = name.ToLower().Replace(" ", "-"),
                Description = description
            };

            await _categoryRepository.AddAsync(newCategory);
            await _categoryRepository.SaveChangesAsync();

            return newCategory.Adapt<CategoryDto>();
        }

        public async Task<bool> UpdateCategoryAsync(string categoryId, string name, string description)
        {
            var category = await _categoryRepository.AsTracking()
                .FirstOrDefaultAsync(c => c.Id == categoryId);

            if (category == null) return false;

            category.Name = name;
            category.Slug = name.ToLower().Replace(" ", "-");
            category.Description = description;

            await _categoryRepository.UpdateAsync(category);
            await _categoryRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCategoryAsync(string categoryId)
        {
            var category = await _categoryRepository.AsTracking()
                .FirstOrDefaultAsync(c => c.Id == categoryId);

            if (category == null) return false;

            await _categoryRepository.DeleteAsync(category);
            await _categoryRepository.SaveChangesAsync();
            return true;
        }
    }
}