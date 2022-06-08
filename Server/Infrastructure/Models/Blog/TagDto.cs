namespace Models.Blog
{
    using Models;

    using Domain.Entities.Blog;

    public class TagDto : BaseDto<TagDto, Tag>
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public List<string> BlogPostIds { get; set; } = new();

        public override void CustomizeMapping(Mapster.TypeAdapterConfig config)
        {
            config.NewConfig<Tag, TagDto>()
                .Map(dest => dest.BlogPostIds, src => src.BlogPosts.Select(bp => bp.Id));
        }
    }
}
