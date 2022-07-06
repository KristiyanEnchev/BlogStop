namespace Application.Handlers.Categories.Queries
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Shared;

    using Models.Blog;

    using Application.Interfaces;

    public record GetCategoryByIdQuery(string CategoryId) : IRequest<Result<CategoryDto>>;

    public class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, Result<CategoryDto>>
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<GetCategoryByIdQueryHandler> _logger;

        public GetCategoryByIdQueryHandler(ICategoryService categoryService, ILogger<GetCategoryByIdQueryHandler> logger)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        public async Task<Result<CategoryDto>> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(request.CategoryId);
                return category != null
                    ? Result<CategoryDto>.SuccessResult(category)
                    : Result<CategoryDto>.Failure(new List<string> { "Category not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching category by ID");
                return Result<CategoryDto>.Failure(new List<string> { ex.Message });
            }
        }
    }
}
