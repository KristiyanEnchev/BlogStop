namespace Domain.Entities.Blog
{
    public class Category : BaseAuditableEntity
    {
        public Category()
        {
        }
        public string Name { get; set; }
        public string Slug { get; set; }
        public string Description { get; set; }
        public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
    }
}