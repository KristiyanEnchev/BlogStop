namespace Application.Handlers.Blog.Commands
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Models.Blog;

    using Shared;

    using Application.Interfaces;

    public record CreateCommentCommand(string PostId, string UserId, string Content, string? ParentCommentId = null)
        : IRequest<Result<CommentDto>>
    {
        public class Handler : IRequestHandler<CreateCommentCommand, Result<CommentDto>>
        {
            private readonly IBlogService _blogService;
            private readonly ILogger<Handler> _logger;

            public Handler(IBlogService blogService, ILogger<Handler> logger)
            {
                _blogService = blogService;
                _logger = logger;
            }

            public async Task<Result<CommentDto>> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var comment = await _blogService.CreateCommentAsync(request.PostId, request.UserId, request.Content, request.ParentCommentId);
                    return Result<CommentDto>.SuccessResult(comment);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error creating comment on post {PostId} by user {UserId}", request.PostId, request.UserId);
                    throw;
                }
            }
        }
    }
}
