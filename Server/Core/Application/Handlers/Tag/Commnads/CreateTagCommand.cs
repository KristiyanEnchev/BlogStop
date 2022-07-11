namespace Application.Handlers.Tag.Commnads
{
    using Microsoft.Extensions.Logging;

    using Application.Interfaces;

    using MediatR;

    using Models.Blog;

    using Shared;

    public record CreateTagCommand(string Name) : IRequest<Result<TagDto>>
    {
        public class CreateTagCommandHandler : IRequestHandler<CreateTagCommand, Result<TagDto>>
        {
            private readonly ITagService _tagService;
            private readonly ILogger<CreateTagCommandHandler> _logger;

            public CreateTagCommandHandler(ITagService tagService, ILogger<CreateTagCommandHandler> logger)
            {
                _tagService = tagService;
                _logger = logger;
            }

            public async Task<Result<TagDto>> Handle(CreateTagCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var newTag = await _tagService.CreateTagAsync(request.Name);
                    return Result<TagDto>.SuccessResult(newTag);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error creating tag {Name}", request.Name);
                    return Result<TagDto>.Failure(new List<string> { "Failed to create tag." });
                }
            }
        }
    }
}
