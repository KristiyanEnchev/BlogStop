namespace Persistence.Context
{
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;

    using Domain.Entities.Blog;
    using Domain.Entities.Identity;

    using Shared.Interfaces;

    public class ApplicationDbContextInitialiser
    {
        private readonly ILogger<ApplicationDbContextInitialiser> _logger;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<UserRole> _roleManager;
        private readonly ITransactionHelper _transactionHelper;

        public ApplicationDbContextInitialiser(
            ILogger<ApplicationDbContextInitialiser> logger,
            ApplicationDbContext context,
            UserManager<User> userManager,
            RoleManager<UserRole> roleManager,
            ITransactionHelper transactionHelper)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _transactionHelper = transactionHelper;
        }

        public async Task InitialiseAsync()
        {
            if (!await _context.Database.CanConnectAsync())
            {
                _logger.LogInformation("Database does not exist. Creating and applying migrations...");
                await _context.Database.MigrateAsync();
                return;
            }

            using var transaction = await _transactionHelper.BeginTransactionAsync();
            try
            {
                var pendingMigrations = (await _context.Database.GetPendingMigrationsAsync()).ToList();
                if (pendingMigrations.Any())
                {
                    _logger.LogInformation("Applying {Count} pending migrations: {Migrations}",
                        pendingMigrations.Count,
                        string.Join(", ", pendingMigrations));
                    await _context.Database.MigrateAsync();
                }
                else
                {
                    _logger.LogInformation("No pending migrations. Database is up to date.");
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while initialising the database.");
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task SeedAsync()
        {
            if (!await _context.Database.CanConnectAsync())
            {
                _logger.LogError("Cannot seed database because it does not exist or cannot be accessed.");
                return;
            }

            using var transaction = await _transactionHelper.BeginTransactionAsync();
            try
            {
                if (!await _context.Set<UserRole>().AnyAsync())
                {
                    await TrySeedAsync();
                    await SeedBlogDataAsync();
                    _logger.LogInformation("Seeding completed successfully");
                }
                else
                {
                    _logger.LogInformation("Skipping seeding as data already exists");
                }

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while seeding the database.");
                await transaction.RollbackAsync();
                throw;
            }
        }

        private async Task TrySeedAsync()
        {
            var administratorRole = new UserRole("Administrator")
            {
                Description = "Admin Role"
            };

            var userRole = new UserRole("User")
            {
                Description = "User Role"
            };

            if (!_roleManager.Roles.Any(r => r.Name == administratorRole.Name))
            {
                await _roleManager.CreateAsync(administratorRole);
            }

            if (!_roleManager.Roles.Any(r => r.Name == userRole.Name))
            {
                await _roleManager.CreateAsync(userRole);
            }

            var adminEmail = "admin@admin.com";
            var adminUser = await _userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new User
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "Admin",
                    LastName = "User",
                    IsActive = true,
                    CreatedBy = "Initial Seed",
                    EmailConfirmed = true
                };

                var createAdminResult = await _userManager.CreateAsync(adminUser, "123456");
                if (createAdminResult.Succeeded)
                {
                    await _userManager.AddToRolesAsync(adminUser, new[] { administratorRole.Name });
                }
                else
                {
                    _logger.LogError("Failed to create admin user: {Errors}", string.Join(", ", createAdminResult.Errors.Select(e => e.Description)));
                }
            }

            var userEmail = "user@example.com";
            var standardUser = await _userManager.FindByEmailAsync(userEmail);
            if (standardUser == null)
            {
                standardUser = new User
                {
                    Id = "58efac42-e31d-4039-bfe1-76672c615dd5",
                    UserName = userEmail,
                    Email = userEmail,
                    FirstName = "User",
                    LastName = "One",
                    IsActive = true,
                    CreatedBy = "Initial Seed",
                    EmailConfirmed = true
                };

                var createUserResult = await _userManager.CreateAsync(standardUser, "123456");
                if (createUserResult.Succeeded)
                {
                    await _userManager.AddToRolesAsync(standardUser, new[] { userRole.Name });
                }
                else
                {
                    _logger.LogError("Failed to create standard user: {Errors}", string.Join(", ", createUserResult.Errors.Select(e => e.Description)));
                }
            }
        }

        private async Task SeedBlogDataAsync()
        {
            _logger.LogInformation("Seeding Blog Data...");

            var users = await _context.Users.ToListAsync();
            if (users.Count < 2)
            {
                _logger.LogError("Not enough users found to seed blog posts.");
                return;
            }

            var authors = new List<Author>();
            foreach (var user in users)
            {
                var author = await _context.Authors.FirstOrDefaultAsync(a => a.Id == user.Id);
                if (author == null)
                {
                    author = new Author
                    {
                        Id = user.Id,
                        Bio = $"Bio for {user.FirstName} {user.LastName}",
                        ProfileImage = "https://example.com/default-profile.jpg"
                    };
                    await _context.Authors.AddAsync(author);
                }
                authors.Add(author);
            }
            await _context.SaveChangesAsync();

            var categories = new List<Category>
            {
                new() { Name = "Programming", Slug = "programming", Description = "Learn coding & best practices." },
                new() { Name = "Software Development", Slug = "software-development", Description = "Latest software development trends." },
                new() { Name = "Tech News", Slug = "tech-news", Description = "Updates on the latest in technology." },
                new() { Name = "Business & Startups", Slug = "business-startups", Description = "Insights into business growth & startups." },
                new() { Name = "AI & Machine Learning", Slug = "ai-machine-learning", Description = "Explore the future of AI." }
            };

            await _context.Categories.AddRangeAsync(categories);
            await _context.SaveChangesAsync();

            var tags = new List<Tag>
            {
                new() { Name = "JavaScript", Slug = "javascript" },
                new() { Name = "Python", Slug = "python" },
                new() { Name = "C#", Slug = "csharp" },
                new() { Name = "AI", Slug = "ai" },
                new() { Name = "Blockchain", Slug = "blockchain" },
                new() { Name = "Startups", Slug = "startups" },
                new() { Name = "Cloud Computing", Slug = "cloud-computing" },
                new() { Name = "Cybersecurity", Slug = "cybersecurity" },
                new() { Name = "Mobile Development", Slug = "mobile-development" },
                new() { Name = "Web Development", Slug = "web-development" }
            };

            await _context.Tags.AddRangeAsync(tags);
            await _context.SaveChangesAsync();

            var blogPosts = new List<BlogPost>
            {
                new()
                {
                    Title = "JavaScript Trends in 2024",
                    Slug = "javascript-trends-2024",
                    Excerpt = "What’s coming next in JavaScript?",
                    Content = "JavaScript continues to evolve with new frameworks...",
                    FeaturedImage = "https://example.com/javascript.jpg",
                    IsPublished = true,
                    CreatedDate = DateTime.UtcNow,
                    AuthorId = authors[0].Id,
                    Categories = new List<Category> { categories[0], categories[2] },
                    Tags = new List<Tag> { tags[0], tags[9] },
                    ViewCount = 120
                },
                new()
                {
                    Title = "AI's Role in Software Development",
                    Slug = "ai-in-software-development",
                    Excerpt = "How AI is changing how we write code.",
                    Content = "Artificial Intelligence is now a core part of development...",
                    FeaturedImage = "https://example.com/ai.jpg",
                    IsPublished = true,
                    CreatedDate = DateTime.UtcNow,
                    AuthorId = authors[1].Id,
                    Categories = new List<Category> { categories[1], categories[4] },
                    Tags = new List<Tag> { tags[3], tags[6] },
                    ViewCount = 200
                },
                new()
                {
                    Title = "How Startups Can Succeed in 2024",
                    Slug = "startups-success-2024",
                    Excerpt = "Key strategies for entrepreneurs.",
                    Content = "Starting a business requires understanding the market...",
                    FeaturedImage = "https://example.com/startups.jpg",
                    IsPublished = true,
                    CreatedDate = DateTime.UtcNow,
                    AuthorId = authors[0].Id,
                    Categories = new List<Category> { categories[3] },
                    Tags = new List<Tag> { tags[5], tags[7] },
                    ViewCount = 300
                },
                new()
                {
                    Title = "Cloud Computing in 2024",
                    Slug = "cloud-computing-2024",
                    Excerpt = "The latest trends in cloud services.",
                    Content = "Cloud computing is now an essential part of IT...",
                    FeaturedImage = "https://example.com/cloud.jpg",
                    IsPublished = true,
                    CreatedDate = DateTime.UtcNow,
                    AuthorId = authors[0].Id,
                    Categories = new List<Category> { categories[1] },
                    Tags = new List<Tag> { tags[6], tags[8] },
                    ViewCount = 250
                },
                new()
                {
                    Title = "Cybersecurity Risks in 2024",
                    Slug = "cybersecurity-risks-2024",
                    Excerpt = "Protect your data in the modern world.",
                    Content = "Cybersecurity threats are increasing...",
                    FeaturedImage = "https://example.com/cybersecurity.jpg",
                    IsPublished = true,
                    CreatedDate = DateTime.UtcNow,
                    AuthorId = authors[1].Id,
                    Categories = new List<Category> { categories[2] },
                    Tags = new List<Tag> { tags[7], tags[9] },
                    ViewCount = 400
                }
            };

            await _context.BlogPosts.AddRangeAsync(blogPosts);
            await _context.SaveChangesAsync();

            if (!blogPosts.Any())
            {
                _logger.LogError("No blog posts found, skipping comment seeding.");
                return;
            }

            var random = new Random();

            var comments = new List<Comment>
            {
                new()
                {
                    Content = "This was really helpful, thanks!",
                    IsApproved = true,
                    BlogPostId = blogPosts[0].Id,
                    AuthorId = authors[1].Id,
                    LikedByUserIds = authors
                        .OrderBy(_ => random.Next())
                        .Take(5) 
                        .Select(a => a.Id)
                        .ToList()
                },
                new()
                {
                    Content = "Great insights on AI!",
                    IsApproved = true,
                    BlogPostId = blogPosts[1].Id,
                    AuthorId = authors[0].Id,
                    LikedByUserIds = authors
                        .OrderBy(_ => random.Next())
                        .Take(8)
                        .Select(a => a.Id)
                        .ToList()
                },
                new()
                {
                    Content = "Startups need to focus on marketing too.",
                    IsApproved = true,
                    BlogPostId = blogPosts[2].Id,
                    AuthorId = authors[1].Id,
                    LikedByUserIds = authors
                        .OrderBy(_ => random.Next())
                        .Take(3)
                        .Select(a => a.Id)
                        .ToList()
                }
            };

            await _context.Comments.AddRangeAsync(comments);
            await _context.SaveChangesAsync();

            foreach (var post in blogPosts)
            {
                post.ViewCount += new Random().Next(10, 100);
            }
            await _context.SaveChangesAsync();

            _logger.LogInformation("Blog Data Seeding Completed.");
        }
    }
}