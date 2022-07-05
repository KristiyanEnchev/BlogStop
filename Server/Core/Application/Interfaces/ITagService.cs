namespace Application.Interfaces
{
    using System.Threading.Tasks;
    using System.Collections.Generic;

    using Models.Blog;

    public interface ITagService
    {
        Task<IReadOnlyList<TagDto>> GetAllTagsAsync();
        Task<TagDto?> GetTagByIdAsync(string tagId);
        Task<TagDto> CreateTagAsync(string name);
        Task<bool> UpdateTagAsync(string tagId, string name);
        Task<bool> DeleteTagAsync(string tagId);
    }
}
