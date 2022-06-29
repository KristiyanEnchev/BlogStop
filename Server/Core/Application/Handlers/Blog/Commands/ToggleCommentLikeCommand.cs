namespace Application.Handlers.Blog.Commands
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Shared;

    using Application.Interfaces;

    public record ToggleCommentLikeCommand(string CommentId, string UserId) : IRequest<Result<bool>>
    {
        public class Handler : IRequestHandler<ToggleCommentLikeCommand, Result<bool>>
        {
            private readonly IBlogService _blogService;
            private readonly ILogger<Handler> _logger;

            public Handler(IBlogService blogService, ILogger<Handler> logger)
            {
                _blogService = blogService;
                _logger = logger;
            }

            public async Task<Result<bool>> Handle(ToggleCommentLikeCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var success = await _blogService.ToggleCommentLikeAsync(request.CommentId, request.UserId);
                    return Result<bool>.SuccessResult(success);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error toggling like on comment {CommentId} by user {UserId}", request.CommentId, request.UserId);
                    throw;
                }
            }
        }
    }
}
