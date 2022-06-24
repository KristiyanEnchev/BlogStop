namespace Application.Handlers.Blog.Commands
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Models.Blog;

    using Shared;

    using Application.Interfaces;

    public record UpdateBlogPostCommand(string PostId, BlogPostRequest Request) : IRequest<Result<bool>>
    {
        public class Handler : IRequestHandler<UpdateBlogPostCommand, Result<bool>>
        {
            private readonly IBlogService _blogService;
            private readonly ILogger<Handler> _logger;

            public Handler(IBlogService blogService, ILogger<Handler> logger)
            {
                _blogService = blogService;
                _logger = logger;
            }

            public async Task<Result<bool>> Handle(UpdateBlogPostCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var success = await _blogService.UpdateBlogPostAsync(request.PostId, request.Request);
                    return Result<bool>.SuccessResult(success);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error updating blog post {PostId}", request.PostId);
                    throw;
                }
            }
        }
    }
}
