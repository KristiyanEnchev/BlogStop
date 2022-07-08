namespace Application.Handlers.Tag.Queries
{
    using Microsoft.Extensions.Logging;

    using Application.Interfaces;

    using MediatR;

    using Models.Blog;

    using Shared;

    public record GetAllTagsQuery : IRequest<Result<IReadOnlyList<TagDto>>>
    {
        public class GetAllTagsQueryHandler : IRequestHandler<GetAllTagsQuery, Result<IReadOnlyList<TagDto>>>
        {
            private readonly ITagService _tagService;
            private readonly ILogger<GetAllTagsQueryHandler> _logger;

            public GetAllTagsQueryHandler(ITagService tagService, ILogger<GetAllTagsQueryHandler> logger)
            {
                _tagService = tagService;
                _logger = logger;
            }

            public async Task<Result<IReadOnlyList<TagDto>>> Handle(GetAllTagsQuery request, CancellationToken cancellationToken)
            {
                try
                {
                    var tags = await _tagService.GetAllTagsAsync();
                    return Result<IReadOnlyList<TagDto>>.SuccessResult(tags);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error retrieving tags");
                    return Result<IReadOnlyList<TagDto>>.Failure(new List<string> { "Failed to retrieve tags." });
                }
            }
        }
    }
}
