namespace Application.Handlers.Categories.Commands
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Shared;

    using Application.Interfaces;

    public record DeleteCategoryCommand(string CategoryId) : IRequest<Result<bool>>;

    public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Result<bool>>
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<DeleteCategoryCommandHandler> _logger;

        public DeleteCategoryCommandHandler(ICategoryService categoryService, ILogger<DeleteCategoryCommandHandler> logger)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        public async Task<Result<bool>> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var success = await _categoryService.DeleteCategoryAsync(request.CategoryId);
                return Result<bool>.SuccessResult(success);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting category");
                return Result<bool>.Failure(new List<string> { ex.Message });
            }
        }
    }
}
