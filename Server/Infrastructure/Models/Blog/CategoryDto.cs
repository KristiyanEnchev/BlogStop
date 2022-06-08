namespace Models.Blog
{
    using Domain.Entities.Blog;

    public class CategoryDto : BaseDto<CategoryDto, Category>
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public List<string> BlogPostIds { get; set; } = new();

        public override void CustomizeMapping(Mapster.TypeAdapterConfig config)
        {
            config.NewConfig<Category, CategoryDto>()
                .Map(dest => dest.BlogPostIds, src => src.BlogPosts.Select(bp => bp.Id));
        }
    }

}
