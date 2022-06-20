namespace Infrastructure.Services.Blog
{
    using Microsoft.EntityFrameworkCore;

    using Mapster;

    using Domain.Entities.Blog;

    using Models.Blog;

    using Shared;
    using Shared.Interfaces;

    using Application.Common;

    public class BlogService
    {
        private readonly IRepository<BlogPost> _blogRepository;
        private readonly IRepository<Comment> _commentRepository;
        private readonly IRepository<Category> _categoryRepository;
        private readonly IRepository<Tag> _tagRepository;

        public BlogService(
            IRepository<BlogPost> blogRepository,
            IRepository<Comment> commentRepository,
            IRepository<Category> categoryRepository,
            IRepository<Tag> tagRepository)
        {
            _blogRepository = blogRepository;
            _commentRepository = commentRepository;
            _categoryRepository = categoryRepository;
            _tagRepository = tagRepository;
        }

        public async Task<BlogPostDto?> GetBlogPostAsync(string postId, string userId)
        {
            var post = await _blogRepository.AsNoTracking()
                .Where(bp => bp.Id == postId)
                .Select(bp => new BlogPostDto
                {
                    Id = bp.Id,
                    Title = bp.Title,
                    Slug = bp.Slug,
                    Excerpt = bp.Excerpt,
                    FeaturedImage = bp.FeaturedImage,
                    AuthorId = bp.AuthorId,
                    AuthorName = $"{bp.Author.FirstName} {bp.Author.LastName}",
                    ViewCount = bp.ViewCount,
                    NumberOfLikes = bp.LikedByUserIds.Count,
                    IsLikedByUser = bp.LikedByUserIds.Contains(userId)
                })
                .FirstOrDefaultAsync();

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
            var comments = await _commentRepository.AsNoTracking()
                .Where(c => c.BlogPostId == postId)
                .Order(sortBy, order)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    AuthorId = c.AuthorId,
                    AuthorName = $"{c.Author.FirstName} {c.Author.LastName}",
                    NumberOfLikes = c.LikedByUserIds.Count,
                    IsLikedByUser = c.LikedByUserIds.Contains(userId),
                    ParentCommentId = c.ParentCommentId
                })
                .ToPaginatedListAsync(page, pageSize);

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
            var comment = await _commentRepository.AsTracking()
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

            await _commentRepository.SaveChangesAsync();
            return true;
        }

        public async Task<BlogPostDto> CreateBlogPostAsync(BlogPostRequest request)
        {
            var categories = await _categoryRepository.AsNoTracking()
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

        public async Task<CommentDto> CreateCommentAsync(string postId, string userId, string content, string? parentCommentId = null)
        {
            var newComment = new Comment
            {
                BlogPostId = postId,
                AuthorId = userId,
                Content = content,
                ParentCommentId = parentCommentId,
                CreatedDate = DateTime.UtcNow
            };

            await _commentRepository.AddAsync(newComment);
            await _commentRepository.SaveChangesAsync();

            return newComment.Adapt<CommentDto>();
        }

        public async Task<bool> DeleteBlogPostAsync(string postId)
        {
            var post = await _blogRepository.AsTracking()
                .FirstOrDefaultAsync(bp => bp.Id == postId);

            if (post == null) return false;

            await _blogRepository.DeleteAsync(post);
            await _blogRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCommentAsync(string commentId)
        {
            var comment = await _commentRepository.AsTracking()
                .FirstOrDefaultAsync(c => c.Id == commentId);

            if (comment == null) return false;

            await _commentRepository.DeleteAsync(comment);
            await _commentRepository.SaveChangesAsync();
            return true;
        }
    }
}
