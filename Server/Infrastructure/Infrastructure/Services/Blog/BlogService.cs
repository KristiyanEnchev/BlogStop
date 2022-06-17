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
        private readonly IRepository<Category> _categorytRepository;
        private readonly IRepository<Tag> _tagRepository;

        public BlogService(
            IRepository<BlogPost> blogRepository,
            IRepository<Comment> commnetRepository,
            IRepository<Category> categorytRepository,
            IRepository<Tag> tagRepository)
        {
            _blogRepository = blogRepository;
            _commnetRepository = commnetRepository;
            _categorytRepository = categorytRepository;
            _tagRepository = tagRepository;
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

        public async Task<bool> ToggleBlogPostLikeAsync(string postId, string userId)
        {
            var post = await _blogRepository.AsTracking()
                .FirstOrDefaultAsync(bp => bp.Id == postId);

            if (post == null) return false;

            if (post.LikedByUserIds.Contains(userId))
            {
                post.LikedByUserIds.Remove(userId);
            }
            else
            {
                post.LikedByUserIds.Add(userId);
            }

            await _blogRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleCommentLikeAsync(string commentId, string userId)
        {
            var comment = await _commnetRepository.AsTracking()
                .FirstOrDefaultAsync(c => c.Id == commentId);

            if (comment == null) return false;

            if (comment.LikedByUserIds.Contains(userId))
            {
                comment.LikedByUserIds.Remove(userId);
            }
            else
            {
                comment.LikedByUserIds.Add(userId);
            }

            await _commnetRepository.SaveChangesAsync();
            return true;
        }

        public async Task<BlogPostDto> CreateBlogPostAsync(BlogPostRequest request)
        {
            var categories = await _categorytRepository.AsNoTracking()
                .Where(c => request.CategoryIds.Contains(c.Id))
                .ToListAsync();

            var existingTags = await _tagRepository.AsNoTracking()
                .Where(t => request.Tags.Contains(t.Name))
                .ToListAsync();

            var newTags = request.Tags
                .Where(tag => existingTags.All(et => et.Name != tag))
                .Select(tag => new Tag { Name = tag, Slug = tag.ToLower().Replace(" ", "-") })
                .ToList();

            if (newTags.Any())
            {
                await _tagRepository.AddRangeAsync(newTags);
                await _tagRepository.SaveChangesAsync();
            }

            var tags = new List<Tag>(existingTags);
            tags.AddRange(newTags);

            var newPost = new BlogPost
            {
                Title = request.Title,
                Slug = request.Slug,
                Excerpt = request.Excerpt,
                Content = request.Content,
                FeaturedImage = request.FeaturedImage,
                AuthorId = request.AuthorId,
                Categories = categories,
                Tags = tags,
                CreatedDate = DateTime.UtcNow,
                IsPublished = false
            };

            await _blogRepository.AddAsync(newPost);
            await _blogRepository.SaveChangesAsync();

            return newPost.Adapt<BlogPostDto>();
        }
    }
}
