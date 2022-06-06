namespace Models.Blog
{
    using Domain.Entities.Blog;

    public class BlogPostDto : BaseAuditableDto<BlogPostDto, BlogPost>
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Excerpt { get; set; }
        public string FeaturedImage { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsPublished { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public int ViewCount { get; set; }
        public int CommentCount { get; set; }

        public override void CustomizeMapping(Mapster.TypeAdapterConfig config)
        {
            config.NewConfig<BlogPost, BlogPostDto>()
                .Map(dest => dest.AuthorName, src => $"{src.Author.FirstName} {src.Author.LastName}")
                .Map(dest => dest.CommentCount, src => src.Comments.Count);
        }
    }
}