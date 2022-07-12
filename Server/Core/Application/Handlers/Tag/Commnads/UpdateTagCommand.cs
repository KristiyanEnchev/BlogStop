namespace Application.Handlers.Tag.Commnads
{
    using Microsoft.Extensions.Logging;

    using Application.Interfaces;

    using MediatR;

    using Shared;

    public record UpdateTagCommand(string TagId, string Name) : IRequest<Result<bool>>
    {
        public class UpdateTagCommandHandler : IRequestHandler<UpdateTagCommand, Result<bool>>
        {
            private readonly ITagService _tagService;
            private readonly ILogger<UpdateTagCommandHandler> _logger;

            public UpdateTagCommandHandler(ITagService tagService, ILogger<UpdateTagCommandHandler> logger)
            {
                _tagService = tagService;
                _logger = logger;
            }

            public async Task<Result<bool>> Handle(UpdateTagCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var result = await _tagService.UpdateTagAsync(request.TagId, request.Name);
                    return result
                        ? Result<bool>.SuccessResult(true)
                        : Result<bool>.Failure(new List<string> { "Tag update failed." });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error updating tag {TagId}", request.TagId);
                    return Result<bool>.Failure(new List<string> { "Failed to update tag." });
                }
            }
        }
    }
}
