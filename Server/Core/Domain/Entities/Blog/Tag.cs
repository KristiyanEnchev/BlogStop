namespace Domain.Entities.Blog
{
    public class Tag : BaseAuditableEntity
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
    }
}