namespace Domain.Entities.Blog
{
    using Domain.Entities.Identity;

    public class Author : User
    {
        public string? Bio { get; set; }
        public string? ProfileImage { get; set; }
        public virtual ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
    }
}