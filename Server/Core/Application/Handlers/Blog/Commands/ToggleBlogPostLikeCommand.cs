namespace Application.Handlers.Blog.Commands
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Shared;

    using Application.Interfaces;

    public record ToggleBlogPostLikeCommand(string PostId, string UserId) : IRequest<Result<bool>>
    {
        public class Handler : IRequestHandler<ToggleBlogPostLikeCommand, Result<bool>>
        {
            private readonly IBlogService _blogService;
            private readonly ILogger<Handler> _logger;

            public Handler(IBlogService blogService, ILogger<Handler> logger)
            {
                _blogService = blogService;
                _logger = logger;
            }

            public async Task<Result<bool>> Handle(ToggleBlogPostLikeCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var success = await _blogService.ToggleBlogPostLikeAsync(request.PostId, request.UserId);
                    return Result<bool>.SuccessResult(success);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error toggling like on blog post {PostId} by user {UserId}", request.PostId, request.UserId);
                    throw;
                }
            }
        }
    }
}
