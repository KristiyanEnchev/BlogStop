namespace Application.Handlers.Categories.Commands
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Shared;

    using Models.Blog;

    using Application.Interfaces;

    public record CreateCategoryCommand(string Name, string Description) : IRequest<Result<CategoryDto>>;

    public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Result<CategoryDto>>
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<CreateCategoryCommandHandler> _logger;

        public CreateCategoryCommandHandler(ICategoryService categoryService, ILogger<CreateCategoryCommandHandler> logger)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        public async Task<Result<CategoryDto>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var category = await _categoryService.CreateCategoryAsync(request.Name, request.Description);
                return Result<CategoryDto>.SuccessResult(category);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating category");
                return Result<CategoryDto>.Failure(new List<string> { ex.Message });
            }
        }
    }
}
