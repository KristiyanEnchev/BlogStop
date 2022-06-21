namespace Application.Interfaces
{
    using Shared;

    using Models.Blog;

    public interface IBlogService
    {
        Task<BlogPostDto?> GetBlogPostAsync(string postId, string userId);
        Task<PaginatedResult<BlogPostDto>> GetBlogPostsAsync(
            int page = 1,
            int pageSize = 10,
            string? category = null,
            string? tag = null,
            string sortBy = "CreatedDate",
            string order = "desc");

        Task<PaginatedResult<CommentDto>> GetCommentsForPostAsync(
            string postId,
            string userId,
            int page = 1,
            int pageSize = 10,
            string sortBy = "CreatedDate",
            string order = "desc");

        Task<bool> ToggleBlogPostLikeAsync(string postId, string userId);
        Task<bool> ToggleCommentLikeAsync(string commentId, string userId);
        Task<BlogPostDto> CreateBlogPostAsync(BlogPostRequest request);
        Task<CommentDto> CreateCommentAsync(string postId, string userId, string content, string? parentCommentId = null);
        Task<bool> DeleteBlogPostAsync(string postId);
        Task<bool> DeleteCommentAsync(string commentId);
        Task<bool> UpdateBlogPostAsync(string postId, BlogPostRequest request);
        Task<bool> UpdateCommentAsync(string commentId, string userId, string newContent);
    }
}