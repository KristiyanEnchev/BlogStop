namespace Application.Handlers.Blog.Commands
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Shared;

    using Application.Interfaces;

    public record UpdateCommentCommand(string CommentId, string UserId, string NewContent) : IRequest<Result<bool>>
    {
        public class Handler : IRequestHandler<UpdateCommentCommand, Result<bool>>
        {
            private readonly IBlogService _blogService;
            private readonly ILogger<Handler> _logger;

            public Handler(IBlogService blogService, ILogger<Handler> logger)
            {
                _blogService = blogService;
                _logger = logger;
            }

            public async Task<Result<bool>> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var success = await _blogService.UpdateCommentAsync(request.CommentId, request.UserId, request.NewContent);
                    return Result<bool>.SuccessResult(success);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error updating comment {CommentId} by user {UserId}", request.CommentId, request.UserId);
                    throw;
                }
            }
        }
    }
}
