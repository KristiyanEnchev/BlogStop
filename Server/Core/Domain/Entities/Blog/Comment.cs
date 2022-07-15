namespace Domain.Entities.Blog
{
    using System.ComponentModel.DataAnnotations.Schema;

    public class Comment : BaseAuditableEntity
    {
        public Comment() { }
        public string Content { get; set; }
        public bool IsApproved { get; set; } = false;
        public string BlogPostId { get; set; }
        public virtual BlogPost BlogPost { get; set; }

        public string AuthorId { get; set; }
        public virtual Author Author { get; set; }

        public string? ParentCommentId { get; set; }
        public virtual Comment? ParentComment { get; set; }
        public virtual ICollection<Comment> Replies { get; set; } = new List<Comment>();

        [NotMapped]
        public int NumberOfLikes => LikedByUserIds.Count;
        public List<string> LikedByUserIds { get; set; } = new();
    }
}
