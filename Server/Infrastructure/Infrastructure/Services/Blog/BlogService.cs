namespace Infrastructure.Services.Blog
{
    using Microsoft.EntityFrameworkCore;

    using Domain.Entities.Blog;

    using Models.Blog;

    using Shared.Interfaces;

    public class BlogService
    {
        private readonly IRepository<BlogPost> _blogRepository;

        public BlogService(IRepository<BlogPost> blogRepository)
        {
            _blogRepository = blogRepository;
        }

        public async Task<BlogPostDto?> GetBlogPostAsync(string postId, string userId)
        {
            var blogPost = await _blogRepository.AsNoTracking()
                .Where(bp => bp.Id == postId)
                .Select(bp => new BlogPostDto
                {
                    Id = bp.Id,
                    Title = bp.Title,
                    AuthorId = bp.AuthorId,
                    AuthorName = bp.Author.FirstName + " " + bp.Author.LastName,
                    ViewCount = bp.ViewCount,
                    NumberOfLikes = bp.LikedByUserIds.Count,
                    IsLikedByUser = bp.LikedByUserIds.Contains(userId)
                })
                .FirstOrDefaultAsync();

            return blogPost;
        }
    }
}
