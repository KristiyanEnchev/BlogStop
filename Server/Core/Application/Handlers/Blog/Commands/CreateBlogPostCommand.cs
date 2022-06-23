namespace Application.Handlers.Blog.Commands
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Models.Blog;

    using Shared;

    using Application.Interfaces;

    public record CreateBlogPostCommand(BlogPostRequest Request) : IRequest<Result<BlogPostDto>>
    {
        public class Handler : IRequestHandler<CreateBlogPostCommand, Result<BlogPostDto>>
        {
            private readonly IBlogService _blogService;
            private readonly ILogger<Handler> _logger;

            public Handler(IBlogService blogService, ILogger<Handler> logger)
            {
                _blogService = blogService;
                _logger = logger;
            }

            public async Task<Result<BlogPostDto>> Handle(CreateBlogPostCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var blogPost = await _blogService.CreateBlogPostAsync(request.Request);
                    return Result<BlogPostDto>.SuccessResult(blogPost);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error creating blog post");
                    throw;
                }
            }
        }
    }
}
