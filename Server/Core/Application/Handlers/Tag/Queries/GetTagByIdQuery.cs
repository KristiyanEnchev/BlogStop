namespace Application.Handlers.Tag.Queries
{
    using Microsoft.Extensions.Logging;

    using Application.Interfaces;

    using MediatR;

    using Models.Blog;

    using Shared;

    public record GetTagByIdQuery(string TagId) : IRequest<Result<TagDto?>>
    {
        public class GetTagByIdQueryHandler : IRequestHandler<GetTagByIdQuery, Result<TagDto?>>
        {
            private readonly ITagService _tagService;
            private readonly ILogger<GetTagByIdQueryHandler> _logger;

            public GetTagByIdQueryHandler(ITagService tagService, ILogger<GetTagByIdQueryHandler> logger)
            {
                _tagService = tagService;
                _logger = logger;
            }

            public async Task<Result<TagDto?>> Handle(GetTagByIdQuery request, CancellationToken cancellationToken)
            {
                try
                {
                    var tag = await _tagService.GetTagByIdAsync(request.TagId);
                    return tag != null
                        ? Result<TagDto?>.SuccessResult(tag)
                        : Result<TagDto?>.Failure(new List<string> { "Tag not found." });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error retrieving tag with ID {TagId}", request.TagId);
                    return Result<TagDto?>.Failure(new List<string> { "Failed to retrieve tag." });
                }
            }
        }
    }
}
