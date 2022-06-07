namespace Models.Blog
{
    using Models;

    using Domain.Entities.Blog;

    public class TagDto : BaseDto<TagDto, Tag>
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public List<BlogPostDto> BlogPosts { get; set; } = new();

        public override void CustomizeMapping(Mapster.TypeAdapterConfig config)
        {
            config.NewConfig<Tag, TagDto>()
                .Map(dest => dest.BlogPosts, src => src.BlogPosts);
        }
    }
}
