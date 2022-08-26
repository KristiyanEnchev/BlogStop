namespace Models.Blog
{
    using Models;

    using Domain.Entities.Blog;

    using Mapster;

    public class CommentDto : BaseAuditableDto<CommentDto, Comment>
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public bool IsApproved { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string? AuthorImage { get; set; }
        public string AuthorProfilePicture { get; set; }
        public string ParentCommentId { get; set; }
        public int NumberOfLikes { get; set; }
        public bool IsLikedByUser { get; set; }
        public List<string> ReplyIds { get; set; } = new();

        public override void CustomizeMapping(Mapster.TypeAdapterConfig config)
        {
            config.NewConfig<Comment, CommentDto>()
                .Map(dest => dest.AuthorName, src => $"{src.Author.User.FirstName} {src.Author.User.LastName}")
                .Map(dest => dest.AuthorImage, src => src.Author.ProfileImage)
                .PreserveReference(true);
        }
    }
}