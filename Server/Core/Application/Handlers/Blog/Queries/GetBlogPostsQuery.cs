namespace Application.Handlers.Blog.Queries
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Models.Blog;

    using Shared;

    using Application.Interfaces;

    public record GetBlogPostsQuery(int Page, int PageSize, string? Category, string? Tag, string SortBy, string Order)
        : IRequest<Result<PaginatedResult<BlogPostDto>>>
    {
        public class Handler : IRequestHandler<GetBlogPostsQuery, Result<PaginatedResult<BlogPostDto>>>
        {
            private readonly IBlogService _blogService;
            private readonly ILogger<Handler> _logger;
            private readonly IUser _user;

            public Handler(IBlogService blogService, ILogger<Handler> logger, IUser user)
            {
                _blogService = blogService;
                _logger = logger;
                _user = user;
            }

            public async Task<Result<PaginatedResult<BlogPostDto>>> Handle(GetBlogPostsQuery request, CancellationToken cancellationToken)
            {
                try
                {
                    var blogPosts = await _blogService.GetPaginatedBlogPostsAsync(
                        request.Page, request.PageSize, request.Category, request.Tag, request.SortBy, request.Order, _user.Id! ?? "Anonimous", cancellationToken);

                    return Result<PaginatedResult<BlogPostDto>>.SuccessResult(blogPosts);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error fetching blog posts");
                    throw;
                }
            }
        }
    }
}
