namespace Models.Blog
{
    using Domain.Entities.Blog;

    public class CategoryDto : BaseDto<CategoryDto, Category>
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public List<BlogPostDto> BlogPosts { get; set; } = new();

        public override void CustomizeMapping(Mapster.TypeAdapterConfig config)
        {
            config.NewConfig<Category, CategoryDto>()
                .Map(dest => dest.BlogPosts, src => src.BlogPosts);
        }
    }
}
