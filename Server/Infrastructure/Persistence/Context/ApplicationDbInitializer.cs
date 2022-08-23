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
                    Content = $"JavaScript continues to evolve with new frameworks... {GetRandomText()}",
                    FeaturedImage = "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg",
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
                    Content = $"Artificial Intelligence is now a core part of development... {GetRandomText()}",
                    FeaturedImage = "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg",
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
                    Content = $"Starting a business requires understanding the market... {GetRandomText()}",
                    FeaturedImage = "https://images.pexels.com/photos/270557/pexels-photo-270557.jpeg",
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
                    Content = $"Cloud computing is now an essential part of IT... {GetRandomText()}",
                    FeaturedImage = "https://images.pexels.com/photos/270557/pexels-photo-270557.jpeg",
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
                    Content = $"Cybersecurity threats are increasing... {GetRandomText()}",
                    FeaturedImage = "https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg",
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

        private static string GetRandomText() 
        {
            return "She travelling acceptance men unpleasant her especially entreaties law. Law forth but end any arise chief arose. Old her say learn these large. Joy fond many ham high seen this. Few preferred continual sir led incommode neglected. Discovered too old insensible collecting unpleasant but invitation.\r\n\r\nRendered her for put improved concerns his. Ladies bed wisdom theirs mrs men months set. Everything so dispatched as it increasing pianoforte. Hearing now saw perhaps minutes herself his. Of instantly excellent therefore difficult he northward. Joy green but least marry rapid quiet but. Way devonshire introduced expression saw travelling affronting. Her and effects affixed pretend account ten natural. Need eat week even yet that. Incommode delighted he resolving sportsmen do in listening.\r\n\r\nOught these are balls place mrs their times add she. Taken no great widow spoke of it small. Genius use except son esteem merely her limits. Sons park by do make on. It do oh cottage offered cottage in written. Especially of dissimilar up attachment themselves by interested boisterous. Linen mrs seems men table. Jennings dashwood to quitting marriage bachelor in. On as conviction in of appearance apartments boisterous.\r\n\r\nFinished her are its honoured drawings nor. Pretty see mutual thrown all not edward ten. Particular an boisterous up he reasonably frequently. Several any had enjoyed shewing studied two. Up intention remainder sportsmen behaviour ye happiness. Few again any alone style added abode ask. Nay projecting unpleasing boisterous eat discovered solicitude. Own six moments produce elderly pasture far arrival. Hold our year they ten upon. Gentleman contained so intention sweetness in on resolving.\r\n\r\nAn do on frankness so cordially immediate recommend contained. Imprudence insensible be literature unsatiable do. Of or imprudence solicitude affronting in mr possession. Compass journey he request on suppose limited of or. She margaret law thoughts proposal formerly. Speaking ladyship yet scarcely and mistaken end exertion dwelling. All decisively dispatched instrument particular way one devonshire. Applauded she sportsman explained for out objection.\r\n\r\nYet bed any for travelling assistance indulgence unpleasing. Not thoughts all exercise blessing. Indulgence way everything joy alteration boisterous the attachment. Party we years to order allow asked of. We so opinion friends me message as delight. Whole front do of plate heard oh ought. His defective nor convinced residence own. Connection has put impossible own apartments boisterous. At jointure ladyship an insisted so humanity he. Friendly bachelor entrance to on by.\r\n\r\nAt as in understood an remarkably solicitude. Mean them very seen she she. Use totally written the observe pressed justice. Instantly cordially far intention recommend estimable yet her his. Ladies stairs enough esteem add fat all enable. Needed its design number winter see. Oh be me sure wise sons no. Piqued ye of am spirit regret. Stimulated discretion impossible admiration in particular conviction up.\r\n\r\nDenote simple fat denied add worthy little use. As some he so high down am week. Conduct esteems by cottage to pasture we winding. On assistance he cultivated considered frequently. Person how having tended direct own day man. Saw sufficient indulgence one own you inquietude sympathize.\r\n\r\nNo depending be convinced in unfeeling he. Excellence she unaffected and too sentiments her. Rooms he doors there ye aware in by shall. Education remainder in so cordially. His remainder and own dejection daughters sportsmen. Is easy took he shed to kind.\r\n\r\nThe him father parish looked has sooner. Attachment frequently gay terminated son. You greater nay use prudent placing. Passage to so distant behaved natural between do talking. Friends off her windows painful. Still gay event you being think nay for. In three if aware he point it. Effects warrant me by no on feeling settled resolve.";
        }
    }
}