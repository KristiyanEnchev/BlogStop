namespace Application.Handlers.Categories.Queries
{
    using Microsoft.Extensions.Logging;

    using MediatR;

    using Shared;

    using Models.Blog;

    public record GetAllCategoriesQuery : IRequest<Result<IReadOnlyList<CategoryDto>>>;

    public class GetAllCategoriesQueryHandler : IRequestHandler<GetAllCategoriesQuery, Result<IReadOnlyList<CategoryDto>>>
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<GetAllCategoriesQueryHandler> _logger;

        public GetAllCategoriesQueryHandler(ICategoryService categoryService, ILogger<GetAllCategoriesQueryHandler> logger)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        public async Task<Result<IReadOnlyList<CategoryDto>>> Handle(GetAllCategoriesQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                return Result<IReadOnlyList<CategoryDto>>.SuccessResult(categories);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching categories");
                return Result<IReadOnlyList<CategoryDto>>.Failure(new List<string> { ex.Message });
            }
        }
    }
}
