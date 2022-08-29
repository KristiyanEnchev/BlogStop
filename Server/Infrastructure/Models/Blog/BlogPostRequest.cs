namespace Models.Blog
{
    public class BlogPostRequest
    {
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Excerpt { get; set; }
        public string Content { get; set; }
        public string FeaturedImage { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsPublished { get; set; } = true;
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public List<string>? CategoryIds { get; set; }
        public List<string>? Tags { get; set; }
    }
}
