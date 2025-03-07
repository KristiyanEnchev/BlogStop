﻿namespace Models.Blog
{
    using Mapster;

    using Domain.Entities.Blog;

    public class BlogPostDto : BaseAuditableDto<BlogPostDto, BlogPost>
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public string Excerpt { get; set; }
        public string Content { get; set; }
        public string FeaturedImage { get; set; }
        public bool IsFeatured { get; set; }
        public bool IsPublished { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public string? AuthorImage { get; set; }
        public int ViewCount { get; set; }
        public int NumberOfLikes { get; set; }
        public bool IsLikedByUser { get; set; }
        public List<string> Categories { get; set; }
        public List<string> Tags { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public List<string> LikedByUserIds { get; set; }

        public override void CustomizeMapping(TypeAdapterConfig config)
        {
            config.NewConfig<BlogPost, BlogPostDto>()
                .Map(dest => dest.AuthorName, src => $"{src.Author.User.FirstName} {src.Author.User.LastName}")
                .Map(dest => dest.AuthorImage, src => src.Author.ProfileImage)
                .PreserveReference(true);
        }
    }
}