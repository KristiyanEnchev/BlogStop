namespace Models.Blog
{
    using Domain.Entities.Blog;

    public class AuthorDto : BaseDto<AuthorDto, Author>
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Bio { get; set; }
        public string ProfileImage { get; set; }
        public string Email { get; set; }
        public List<string> BlogPostIds { get; set; } = new();

        public override void CustomizeMapping(Mapster.TypeAdapterConfig config)
        {
            config.NewConfig<Author, AuthorDto>()
                .Map(dest => dest.Name, src => $"{src.FirstName} {src.LastName}")
                .Map(dest => dest.BlogPostIds, src => src.BlogPosts.Select(bp => bp.Id));
        }
    }
}
