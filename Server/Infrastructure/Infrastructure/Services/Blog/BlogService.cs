namespace Infrastructure.Services.Blog
{
    using Microsoft.EntityFrameworkCore;

    using Domain.Entities.Blog;

    using Models.Blog;

    using Shared;
    using Shared.Interfaces;

    using Mapster;

    using Application.Common;

    public class BlogService
    {
        private readonly IRepository<BlogPost> _blogRepository;
        private readonly IRepository<Comment> _commnetRepository;

        public BlogService(IRepository<BlogPost> blogRepository, IRepository<Comment> commnetRepository)
        {
            _blogRepository = blogRepository;
            _commnetRepository = commnetRepository;
        }

        public async Task<BlogPostDto?> GetBlogPostAsync(string postId, string userId)
        {
            var post = await _blogRepository.AsNoTracking()
                .Where(bp => bp.Id == postId)
                .ProjectToType<BlogPostDto>()
                .FirstOrDefaultAsync();

            if (post != null)
            {
                post.IsLikedByUser = await _blogRepository.AsNoTracking()
                    .Where(bp => bp.Id == postId && bp.LikedByUserIds.Contains(userId))
                    .AnyAsync();
            }

            return post;
        }

        public async Task<PaginatedResult<BlogPostDto>> GetBlogPostsAsync(
            int page = 1,
            int pageSize = 10,
            string? category = null,
            string? tag = null,
            string sortBy = "CreatedDate",
            string order = "desc")
        {
            var query = _blogRepository.AsNoTracking();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(bp => bp.Categories.Any(c => c.Name == category));
            }

            if (!string.IsNullOrEmpty(tag))
            {
                query = query.Where(bp => bp.Tags.Any(t => t.Name == tag));
            }

            return await query
                .Order(sortBy, order)
                .ProjectToType<BlogPostDto>()
                .ToPaginatedListAsync(page, pageSize);
        }

        public async Task<PaginatedResult<CommentDto>> GetCommentsForPostAsync(
            string postId,
            string userId,
            int page = 1,
            int pageSize = 10,
            string sortBy = "CreatedDate",
            string order = "desc")
        {
            var comments = await _commnetRepository.AsNoTracking()
                .Where(c => c.BlogPostId == postId)
                .Order(sortBy, order)
                .ProjectToType<CommentDto>()
                .ToPaginatedListAsync(page, pageSize);

            foreach (var comment in comments.Data)
            {
                comment.IsLikedByUser = await _commnetRepository.AsNoTracking()
                    .Where(c => c.Id == comment.Id && c.LikedByUserIds.Contains(userId))
                    .AnyAsync();
            }

            return comments;
        }
    }
}
