namespace Persistence.Configurations
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    using Domain.Entities.Blog;

    public class CommentConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            builder.ToTable("Comments", "Blog");

            builder.HasKey(c => c.Id);
            builder.Property(c => c.Content).IsRequired();

            builder
                .HasOne(c => c.BlogPost)
                .WithMany(bp => bp.Comments)
                .HasForeignKey(c => c.BlogPostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .HasOne(c => c.Author)
                .WithMany()
                .HasForeignKey(c => c.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // Add indexes for common query paths
            builder.HasIndex(c => c.BlogPostId);
            builder.HasIndex(c => c.AuthorId);
            builder.HasIndex(c => c.ParentCommentId);
            builder.HasIndex(c => c.CreatedDate);
        }
    }
}
