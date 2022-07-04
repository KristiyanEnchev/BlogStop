namespace Infrastructure.Services.Blog
{
    using Microsoft.EntityFrameworkCore;

    using Mapster;

    using Domain.Entities.Blog;

    using Models.Blog;

    using Shared.Interfaces;

    public class TagService
    {
        private readonly IRepository<Tag> _tagRepository;

        public TagService(IRepository<Tag> tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public async Task<IReadOnlyList<TagDto>> GetAllTagsAsync()
        {
            return await _tagRepository.AsNoTracking()
                .ProjectToType<TagDto>()
                .ToListAsync();
        }

        public async Task<TagDto?> GetTagByIdAsync(string tagId)
        {
            return await _tagRepository.AsNoTracking()
                .Where(t => t.Id == tagId)
                .ProjectToType<TagDto>()
                .FirstOrDefaultAsync();
        }

        public async Task<TagDto> CreateTagAsync(string name)
        {
            var newTag = new Tag
            {
                Name = name,
                Slug = name.ToLower().Replace(" ", "-")
            };

            await _tagRepository.AddAsync(newTag);
            await _tagRepository.SaveChangesAsync();

            return newTag.Adapt<TagDto>();
        }

        public async Task<bool> UpdateTagAsync(string tagId, string name)
        {
            var tag = await _tagRepository.AsTracking()
                .FirstOrDefaultAsync(t => t.Id == tagId);

            if (tag == null) return false;

            tag.Name = name;
            tag.Slug = name.ToLower().Replace(" ", "-");

            await _tagRepository.UpdateAsync(tag);
            await _tagRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteTagAsync(string tagId)
        {
            var tag = await _tagRepository.AsTracking()
                .FirstOrDefaultAsync(t => t.Id == tagId);

            if (tag == null) return false;

            await _tagRepository.DeleteAsync(tag);
            await _tagRepository.SaveChangesAsync();
            return true;
        }
    }
}