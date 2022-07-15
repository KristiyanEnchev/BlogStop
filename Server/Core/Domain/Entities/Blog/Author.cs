namespace Domain.Entities.Blog
{
    using Domain.Entities.Identity;

    public class Author : BaseAuditableEntity
    {
        public Author() { }

        public string Id { get; set; }
        public virtual User User { get; set; }

        public string? Bio { get; set; }
        public string? ProfileImage { get; set; }
        public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
    }
}