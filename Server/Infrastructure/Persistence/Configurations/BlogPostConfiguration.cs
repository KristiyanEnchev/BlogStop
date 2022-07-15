namespace Persistence.Configurations
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    using Domain.Entities.Blog;

    public class BlogPostConfiguration : IEntityTypeConfiguration<BlogPost>
    {
        public void Configure(EntityTypeBuilder<BlogPost> builder)
        {
            builder.ToTable("BlogPosts", "Blog");

            builder.HasKey(bp => bp.Id);
            builder.Property(bp => bp.Title).HasMaxLength(255).IsRequired();
            builder.Property(bp => bp.Slug).HasMaxLength(255).IsRequired();
            builder.Property(bp => bp.Content).IsRequired();
            builder.Property(bp => bp.FeaturedImage).HasMaxLength(500);

            builder
                .HasOne(bp => bp.Author)
                .WithMany(a => a.BlogPosts)
                .HasForeignKey(bp => bp.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(bp => bp.Categories)
                   .WithMany(c => c.BlogPosts)
                   .UsingEntity(j => j.ToTable("BlogPostCategories"));

            builder.HasMany(bp => bp.Tags)
                   .WithMany(t => t.BlogPosts)
                   .UsingEntity(j => j.ToTable("BlogPostTags"));
                   
            // Add indexes for common query paths
            builder.HasIndex(p => p.Slug);
            builder.HasIndex(p => p.AuthorId);
            builder.HasIndex(p => p.CreatedDate);
            builder.HasIndex(p => p.IsPublished);
            builder.HasIndex(p => p.IsFeatured);
        }
    }
}
