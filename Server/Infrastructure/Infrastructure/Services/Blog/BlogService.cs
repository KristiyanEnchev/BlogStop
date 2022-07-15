namespace Infrastructure.Services.Blog
{
    using Microsoft.EntityFrameworkCore;

    using Mapster;

    using Domain.Entities.Blog;

    using Models.Blog;

    using Shared;
    using Shared.Interfaces;

    using Application.Common;
    using Application.Interfaces;
    using System.Threading;

    public class BlogService : IBlogService
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

        public async Task<BlogPostDto> GetBlogPostByIdAsync(string id, string userId, CancellationToken cancellationToken = default)
        {
            var blogPostProjection = await _blogRepository
                .Query()
                .Include(x => x.Author)
                .ThenInclude(x => x.User)
                .ProjectToType<BlogPostDto>()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (blogPostProjection == null)
                return null;

            blogPostProjection.IsLikedByUser = blogPostProjection.LikedByUserIds.Contains(userId);

            return blogPostProjection;
        }

        public async Task<PaginatedResult<BlogPostDto>> GetPaginatedBlogPostsAsync(
            int page,
            int pageSize,
            string? category = null,
            string? tag = null,
            string sortBy = "CreatedDate",
            string orderDirection = "desc",
            string userId = "Anonymous",
            CancellationToken cancellationToken = default)
        {
            var query = _blogRepository
                .IncludeEntity(b => b.Author)
                .AsNoTracking();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(bp => bp.Categories.Any(c => c.Name == category));
            }

            if (!string.IsNullOrEmpty(tag))
            {
                query = query.Where(bp => bp.Tags.Any(t => t.Name == tag));
            }

            query = query.Order(sortBy, orderDirection);

            var count = await query.CountAsync(cancellationToken);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ProjectToType<BlogPostDto>()
                .ToListAsync(cancellationToken);

            foreach (var item in items)
            {
                item.IsLikedByUser = item.LikedByUserIds.Contains(userId);
            }

            return PaginatedResult<BlogPostDto>.Create(
                items,
                count,
                page,
                pageSize);
        }

        public async Task<PaginatedResult<CommentDto>> GetCommentsForPostAsync(
            string postId,
            string userId,
            int page = 1,
            int pageSize = 10,
            string sortBy = "CreatedDate",
            string order = "desc",
            CancellationToken cancellationToken = default)
        {
            var query = _commentRepository
                .IncludeEntity(c => c.Author)
                .AsNoTracking()
                .Where(c => c.BlogPostId == postId);

            query = query.Order(sortBy, order);

            var totalCount = await query.CountAsync(cancellationToken);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    AuthorId = c.AuthorId,
                    //AuthorName = $"{c.Author.FirstName} {c.Author.LastName}",
                    NumberOfLikes = c.LikedByUserIds.Count,
                    IsLikedByUser = c.LikedByUserIds.Contains(userId),
                    ParentCommentId = c.ParentCommentId,
                    CreatedDate = c.CreatedDate,
                    UpdatedDate = c.UpdatedDate
                })
                .ToListAsync(cancellationToken);

            return PaginatedResult<CommentDto>.Create(
                items,
                totalCount,
                page,
                pageSize);
        }

        public async Task<bool> ToggleBlogPostLikeAsync(string postId, string userId, CancellationToken cancellationToken = default)
        {
            var post = await _blogRepository
                .AsTracking()
                .FirstOrDefaultAsync(bp => bp.Id == postId, cancellationToken);

            if (post == null) return false;

            if (post.LikedByUserIds.Contains(userId))
            {
                post.LikedByUserIds.Remove(userId);
            }
            else
            {
                post.LikedByUserIds.Add(userId);
            }

            await _blogRepository.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> ToggleCommentLikeAsync(string commentId, string userId, CancellationToken cancellationToken = default)
        {
            var comment = await _commentRepository
                .AsTracking()
                .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);

            if (comment == null) return false;

            if (comment.LikedByUserIds.Contains(userId))
            {
                comment.LikedByUserIds.Remove(userId);
            }
            else
            {
                comment.LikedByUserIds.Add(userId);
            }

            await _commentRepository.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<BlogPostDto> CreateBlogPostAsync(BlogPostRequest request, CancellationToken cancellationToken = default)
        {
            var categories = await _categoryRepository
                .AsNoTracking()
                .Where(c => request.CategoryIds.Contains(c.Id))
                .ToListAsync(cancellationToken);

            var existingTags = await _tagRepository
                .AsNoTracking()
                .Where(t => request.Tags.Contains(t.Name))
                .ToListAsync(cancellationToken);

            var newTags = request.Tags
                .Where(tag => existingTags.All(et => et.Name != tag))
                .Select(tag => new Tag { Name = tag, Slug = tag.ToLower().Replace(" ", "-") })
                .ToList();

            if (newTags.Any())
            {
                await _tagRepository.AddRangeAsync(newTags, cancellationToken);
                await _tagRepository.SaveChangesAsync(cancellationToken);
            }

            var allTags = new List<Tag>(existingTags);
            allTags.AddRange(newTags);

            var newPost = new BlogPost
            {
                Title = request.Title,
                Slug = request.Slug,
                Excerpt = request.Excerpt,
                Content = request.Content,
                FeaturedImage = request.FeaturedImage,
                AuthorId = request.AuthorId,
                Categories = categories,
                Tags = allTags,
                CreatedDate = DateTime.UtcNow,
                IsPublished = true,
            };

            await _blogRepository.AddAsync(newPost, cancellationToken);
            await _blogRepository.SaveChangesAsync(cancellationToken);

            return newPost.Adapt<BlogPostDto>();
        }

        public async Task<CommentDto> CreateCommentAsync(string postId, string userId, string content, string? parentCommentId = null, CancellationToken cancellationToken = default)
        {
            var newComment = new Comment
            {
                BlogPostId = postId,
                AuthorId = userId,
                Content = content,
                ParentCommentId = parentCommentId,
                CreatedDate = DateTime.UtcNow
            };

            await _commentRepository.AddAsync(newComment, cancellationToken);
            await _commentRepository.SaveChangesAsync(cancellationToken);

            var comment = await _commentRepository
                .IncludeEntity(c => c.Author)
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == newComment.Id, cancellationToken);

            return comment.Adapt<CommentDto>();
        }

        public async Task<bool> DeleteBlogPostAsync(string postId, CancellationToken cancellationToken = default)
        {
            var post = await _blogRepository
                .AsTracking()
                .FirstOrDefaultAsync(bp => bp.Id == postId, cancellationToken);

            if (post == null) return false;

            await _blogRepository.DeleteAsync(post, cancellationToken);
            await _blogRepository.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteCommentAsync(string commentId, CancellationToken cancellationToken = default)
        {
            var comment = await _commentRepository
                .AsTracking()
                .FirstOrDefaultAsync(c => c.Id == commentId, cancellationToken);

            if (comment == null) return false;

            await _commentRepository.DeleteAsync(comment, cancellationToken);
            await _commentRepository.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> UpdateBlogPostAsync(string postId, BlogPostRequest request, CancellationToken cancellationToken = default)
        {
            var post = await _blogRepository
                .AsTracking()
                .Include(bp => bp.Categories)
                .Include(bp => bp.Tags)
                .FirstOrDefaultAsync(bp => bp.Id == postId, cancellationToken);

            if (post == null) return false;

            post.Title = request.Title;
            post.Slug = request.Slug;
            post.Excerpt = request.Excerpt;
            post.Content = request.Content;
            post.FeaturedImage = request.FeaturedImage;
            post.IsPublished = true;
            post.UpdatedDate = DateTime.UtcNow;

            var newCategories = await _categoryRepository
                .AsNoTracking()
                .Where(c => request.CategoryIds.Contains(c.Id))
                .ToListAsync(cancellationToken);

            post.Categories.Clear();
            foreach (var category in newCategories)
            {
                post.Categories.Add(category);
            }

            var existingTags = await _tagRepository
                .AsNoTracking()
                .Where(t => request.Tags.Contains(t.Name))
                .ToListAsync(cancellationToken);

            var newTags = request.Tags
                .Where(tag => existingTags.All(et => et.Name != tag))
                .Select(tag => new Tag { Name = tag, Slug = tag.ToLower().Replace(" ", "-") })
                .ToList();

            if (newTags.Any())
            {
                await _tagRepository.AddRangeAsync(newTags, cancellationToken);
                await _tagRepository.SaveChangesAsync(cancellationToken);
            }

            post.Tags.Clear();
            foreach (var tag in existingTags.Concat(newTags))
            {
                post.Tags.Add(tag);
            }

            await _blogRepository.UpdateAsync(post, cancellationToken);
            await _blogRepository.SaveChangesAsync(cancellationToken);

            return true;
        }

        public async Task<bool> UpdateCommentAsync(string commentId, string userId, string newContent, CancellationToken cancellationToken = default)
        {
            var comment = await _commentRepository
                .AsTracking()
                .FirstOrDefaultAsync(c => c.Id == commentId && c.AuthorId == userId, cancellationToken);

            if (comment == null) return false;

            comment.Content = newContent;
            comment.UpdatedDate = DateTime.UtcNow;

            await _commentRepository.UpdateAsync(comment, cancellationToken);
            await _commentRepository.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}