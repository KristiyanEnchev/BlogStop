namespace Application.Handlers.Category.Commands
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Shared;

    using Application.Interfaces;

    public record UpdateCategoryCommand(string CategoryId, string Name, string Description) : IRequest<Result<bool>>;

    public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, Result<bool>>
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<UpdateCategoryCommandHandler> _logger;

        public UpdateCategoryCommandHandler(ICategoryService categoryService, ILogger<UpdateCategoryCommandHandler> logger)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        public async Task<Result<bool>> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var success = await _categoryService.UpdateCategoryAsync(request.CategoryId, request.Name, request.Description);
                return Result<bool>.SuccessResult(success);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating category");
                return Result<bool>.Failure(new List<string> { ex.Message });
            }
        }
    }
}
