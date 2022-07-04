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

        public async Task<bool> UpdateBlogPostAsync(string postId, BlogPostRequest request)
        {
            var post = await _blogRepository.AsTracking()
                .Include(bp => bp.Categories)
                .Include(bp => bp.Tags)
                .FirstOrDefaultAsync(bp => bp.Id == postId);

            if (post == null) return false;

            post.Title = request.Title;
            post.Slug = request.Slug;
            post.Excerpt = request.Excerpt;
            post.Content = request.Content;
            post.FeaturedImage = request.FeaturedImage;
            post.UpdatedDate = DateTime.UtcNow;

            var newCategories = await _categoryRepository.AsNoTracking()
                .Where(c => request.CategoryIds.Contains(c.Id))
                .ToListAsync();

            post.Categories.Clear();
            post.Categories.ToList().AddRange(newCategories);

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

            post.Tags.Clear();
            post.Tags.ToList().AddRange(existingTags);
            post.Tags.ToList().AddRange(newTags);

            await _blogRepository.UpdateAsync(post);
            await _blogRepository.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UpdateCommentAsync(string commentId, string userId, string newContent)
        {
            var comment = await _commentRepository.AsTracking()
                .FirstOrDefaultAsync(c => c.Id == commentId && c.AuthorId == userId);

            if (comment == null) return false;

            comment.Content = newContent;
            comment.UpdatedDate = DateTime.UtcNow;

            await _commentRepository.UpdateAsync(comment);
            await _commentRepository.SaveChangesAsync();

            return true;
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
