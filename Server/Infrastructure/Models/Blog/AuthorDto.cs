namespace Models.Blog
{
    using Mapster;

    using Domain.Entities.Blog;

    public class AuthorDto : BaseDto<AuthorDto, Author>
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Bio { get; set; }
        public string ProfileImage { get; set; }
        public string Email { get; set; }
        public List<BlogPostDto> BlogPosts { get; set; }

        public override void CustomizeMapping(TypeAdapterConfig config)
        {
            config.NewConfig<Author, AuthorDto>()
            .Map(dest => dest.Id, src => src.Id)
            .Map(dest => dest.Name, src =>
                $"{src.User.FirstName} {src.User.LastName}".Trim())
            .Map(dest => dest.Email, src => src.User.Email)
            .Map(dest => dest.BlogPosts, src => src.BlogPosts)
            .PreserveReference(true);
        }
    }
}
