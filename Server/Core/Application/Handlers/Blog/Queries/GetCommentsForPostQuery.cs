namespace Application.Handlers.Blog.Queries
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Models.Blog;

    using Shared;

    using Application.Interfaces;

    public record GetCommentsForPostQuery(string PostId, string UserId, int Page, int PageSize, string SortBy, string Order)
        : IRequest<Result<PaginatedResult<CommentDto>>>
    {
        public class Handler : IRequestHandler<GetCommentsForPostQuery, Result<PaginatedResult<CommentDto>>>
        {
            private readonly IBlogService _blogService;
            private readonly ILogger<Handler> _logger;

            public Handler(IBlogService blogService, ILogger<Handler> logger)
            {
                _blogService = blogService;
                _logger = logger;
            }

            public async Task<Result<PaginatedResult<CommentDto>>> Handle(GetCommentsForPostQuery request, CancellationToken cancellationToken)
            {
                try
                {
                    var comments = await _blogService.GetCommentsForPostAsync(
                        request.PostId, request.UserId, request.Page, request.PageSize, request.SortBy, request.Order);

                    return Result<PaginatedResult<CommentDto>>.SuccessResult(comments);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error fetching comments for post {PostId}", request.PostId);
                    throw;
                }
            }
        }
    }
}
