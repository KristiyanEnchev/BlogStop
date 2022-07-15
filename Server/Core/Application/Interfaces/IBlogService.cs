namespace Application.Interfaces
{
    using Shared;

    using Models.Blog;

    public interface IBlogService
    {
        Task<BlogPostDto?> GetBlogPostByIdAsync(string id, string userId, CancellationToken cancellationToken = default);
        Task<PaginatedResult<BlogPostDto>> GetPaginatedBlogPostsAsync(
            int page,
            int pageSize,
            string? category = null,
            string? tag = null,
            string sortBy = "CreatedDate",
            string orderDirection = "desc",
            string userId = "Anonymous",
            CancellationToken cancellationToken = default);
        Task<PaginatedResult<CommentDto>> GetCommentsForPostAsync(
            string postId,
            string userId,
            int page = 1,
            int pageSize = 10,
            string sortBy = "CreatedDate",
            string order = "desc",
            CancellationToken cancellationToken = default);

        Task<bool> ToggleBlogPostLikeAsync(string postId, string userId, CancellationToken cancellationToken = default);
        Task<bool> ToggleCommentLikeAsync(string commentId, string userId, CancellationToken cancellationToken = default);

        Task<BlogPostDto> CreateBlogPostAsync(BlogPostRequest request, CancellationToken cancellationToken = default);
        Task<CommentDto> CreateCommentAsync(string postId, string userId, string content, string? parentCommentId = null, CancellationToken cancellationToken = default);

        Task<bool> DeleteBlogPostAsync(string postId, CancellationToken cancellationToken = default);
        Task<bool> DeleteCommentAsync(string commentId, CancellationToken cancellationToken = default);

        Task<bool> UpdateBlogPostAsync(string postId, BlogPostRequest request, CancellationToken cancellationToken = default);
        Task<bool> UpdateCommentAsync(string commentId, string userId, string newContent, CancellationToken cancellationToken = default);
    }
}