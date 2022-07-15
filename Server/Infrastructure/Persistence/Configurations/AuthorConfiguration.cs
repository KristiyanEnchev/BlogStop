namespace Persistence.Configurations
{
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    using Domain.Entities.Blog;

    public class AuthorConfiguration : IEntityTypeConfiguration<Author>
    {
        public void Configure(EntityTypeBuilder<Author> builder)
        {
            builder.ToTable("Authors", "Blog");

            builder.HasKey(a => a.Id);

            builder.HasOne(a => a.User)
                .WithOne()
                .HasForeignKey<Author>(a => a.Id)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(a => a.Bio).HasMaxLength(1000);
            builder.Property(a => a.ProfileImage).HasMaxLength(500);
        }
    }
}
