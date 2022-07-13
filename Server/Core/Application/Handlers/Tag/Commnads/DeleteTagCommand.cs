namespace Application.Handlers.Tag.Commnads
{
    using Microsoft.Extensions.Logging;

    using Application.Interfaces;

    using MediatR;

    using Shared;

    public record DeleteTagCommand(string TagId) : IRequest<Result<bool>>
    {
        public class DeleteTagCommandHandler : IRequestHandler<DeleteTagCommand, Result<bool>>
        {
            private readonly ITagService _tagService;
            private readonly ILogger<DeleteTagCommandHandler> _logger;

            public DeleteTagCommandHandler(ITagService tagService, ILogger<DeleteTagCommandHandler> logger)
            {
                _tagService = tagService;
                _logger = logger;
            }

            public async Task<Result<bool>> Handle(DeleteTagCommand request, CancellationToken cancellationToken)
            {
                try
                {
                    var result = await _tagService.DeleteTagAsync(request.TagId);
                    return result
                        ? Result<bool>.SuccessResult(true)
                        : Result<bool>.Failure(new List<string> { "Tag deletion failed." });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error deleting tag {TagId}", request.TagId);
                    return Result<bool>.Failure(new List<string> { "Failed to delete tag." });
                }
            }
        }
    }
}
