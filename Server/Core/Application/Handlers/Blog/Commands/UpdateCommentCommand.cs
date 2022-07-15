namespace Application.Handlers.Blog.Commands
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Shared;

    using Application.Interfaces;

    public record UpdateCommentCommand(string CommentId, string NewContent) : IRequest<Result<bool>>
    {
        public class Handler : IRequestHandler<UpdateCommentCommand, Result<bool>>
        {
            private readonly IUser _user;
            private readonly IBlogService _blogService;
            private readonly ILogger<Handler> _logger;

            public Handler(IBlogService blogService, ILogger<Handler> logger, IUser user)
            {
                _blogService = blogService;
                _logger = logger;
                _user = user;
            }

            public async Task<Result<bool>> Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var success = await _blogService.UpdateCommentAsync(request.CommentId, _user.Id!, request.NewContent);
                    return Result<bool>.SuccessResult(success);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error updating comment {CommentId} by user {UserId}", request.CommentId, _user.Id!);
                    throw;
                }
            }
        }
    }
}
