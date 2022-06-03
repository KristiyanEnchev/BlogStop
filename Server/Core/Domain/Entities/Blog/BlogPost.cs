namespace Domain.Entities.Blog
{
    public class BlogPost : BaseAuditableEntity
    {
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Content { get; set; }
        public string Excerpt { get; set; }
        public string FeaturedImage { get; set; } =
            "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png";

        public bool IsFeatured { get; set; } = false;
        public bool IsPublished { get; set; } = false;
        public string AuthorId { get; set; }
        public virtual Author Author { get; set; }

        public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
        public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

        public int ViewCount { get; set; } = 0;
    }
}
