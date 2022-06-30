namespace Application.Handlers.Blog.Queries
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Models.Blog;

    using Shared;

    using Application.Interfaces;

    public record GetBlogPostQuery(string PostId) : IRequest<Result<BlogPostDto>>
    {
        public class Handler : IRequestHandler<GetBlogPostQuery, Result<BlogPostDto>>
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

            public async Task<Result<BlogPostDto>> Handle(GetBlogPostQuery request, CancellationToken cancellationToken)
            {
                try
                {
                    var blogPost = await _blogService.GetBlogPostAsync(request.PostId, _user.Id! ?? "Anonimous");
                    return Result<BlogPostDto>.SuccessResult(blogPost!);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error fetching blog post {PostId}", request.PostId);
                    throw;
                }
            }
        }
    }
}
