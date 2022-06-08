namespace Models.Blog
{
    using Models;

    using Domain.Entities.Blog;

    public class CommentDto : BaseAuditableDto<CommentDto, Comment>
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public bool IsApproved { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string AuthorProfilePicture { get; set; }
        public string ParentCommentId { get; set; }
        public int NumberOfLikes { get; set; }
        public List<string> ReplyIds { get; set; } = new();

        public override void CustomizeMapping(Mapster.TypeAdapterConfig config)
        {
            config.NewConfig<Comment, CommentDto>()
                .Map(dest => dest.AuthorName, src => src.Author.FirstName + " " + src.Author.LastName)
                .Map(dest => dest.AuthorProfilePicture, src => src.Author.ProfileImage)
                .Map(dest => dest.ReplyIds, src => src.Replies.Select(r => r.Id));
        }
    }
}