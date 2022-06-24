namespace Application.Handlers.Blog.Commands
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Shared;

    using Application.Interfaces;

    public record DeleteBlogPostCommand(string PostId) : IRequest<Result<bool>>
    {
        public class Handler : IRequestHandler<DeleteBlogPostCommand, Result<bool>>
        {
            private readonly IBlogService _blogService;
            private readonly ILogger<Handler> _logger;

            public Handler(IBlogService blogService, ILogger<Handler> logger)
            {
                _blogService = blogService;
                _logger = logger;
            }

            public async Task<Result<bool>> Handle(DeleteBlogPostCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var success = await _blogService.DeleteBlogPostAsync(request.PostId);
                    return Result<bool>.SuccessResult(success);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error deleting blog post {PostId}", request.PostId);
                    throw;
                }
            }
        }
    }
}
