namespace Web
{
    using System.Reflection;
    using System.Security.Authentication;

    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Routing;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.AspNetCore.Server.Kestrel.Https;

    using Application;
    using Application.Common;
    using Application.Interfaces;

    using Web.Services;
    using Web.Extensions.Swagger;
    using Web.Extensions.Middleware;
    using Web.Extensions.Healtchecks;

    using Infrastructure;
    using Infrastructure.Services.Blog;

    using Persistence;
    using Persistence.Context;

    public static class Startup
    {
        public static IServiceCollection AddWeb(this IServiceCollection services, IConfiguration config)
        {
            services.AddHttpContextAccessor();
            services.AddControllers().AddApplicationPart(Assembly.GetExecutingAssembly()).AddJsonOptions(options =>
            {
                var defaultOptions = JsonSerializerOptionsProvider.CreateDefaultOptions();
                options.JsonSerializerOptions.PropertyNamingPolicy = defaultOptions.PropertyNamingPolicy;
                options.JsonSerializerOptions.DefaultIgnoreCondition = defaultOptions.DefaultIgnoreCondition;

                foreach (var converter in defaultOptions.Converters)
                {
                    options.JsonSerializerOptions.Converters.Add(converter);
                }
            });

            services.AddApplication();
            services.AddInfrastructure(config);
            services.AddPersistence(config);

            services.AddSwaggerDocumentation();
            services.AddRouting(options => options.LowercaseUrls = true);

            services.AddCorsPolicy(config);

            services.AddHealth(config);
            services.AddScoped<IUser, CurrentUser>();
            services.AddScoped<IBlogService, BlogService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ITagService, TagService>();

            return services;
        }

        public static async Task InitializeDatabase(this IServiceProvider services)
        {
            using var scope = services.CreateScope();

            var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitialiser>();

            await initialiser.InitialiseAsync();

            await initialiser.SeedAsync();
        }

        public static IServiceCollection AddConfigurations(this IServiceCollection services, IWebHostBuilder hostBulder, IWebHostEnvironment env)
        {
            hostBulder.ConfigureAppConfiguration(config =>
            {
                config.SetBasePath(Directory.GetCurrentDirectory());
                config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
                config.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true, reloadOnChange: true);
                config.AddEnvironmentVariables();
                config.Build();
            });

            AddKestrelConfig(hostBulder);

            return services;
        }

        private static IWebHostBuilder AddKestrelConfig(IWebHostBuilder builder)
        {
            builder.ConfigureKestrel((context, serverOptions) =>
            {
                serverOptions.ListenAnyIP(8080);

                serverOptions.ConfigureHttpsDefaults(options =>
                {
                    options.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13;
                    options.ClientCertificateMode = ClientCertificateMode.AllowCertificate;
                });
            });

            return builder;
        }

        public static IApplicationBuilder UseWeb(this IApplicationBuilder builder)
        {
            builder.UseSwaggerDocumentation()
                    .UseStaticFiles()
                    .UseHttpsRedirection()
                    .UseErrorHandler()
                    .UseRouting()
                    .UseCors("CleanArchitecture")
                    .UseAuthentication()
                    .UseAuthorization()
                    .UseEndpoints(endpoints => endpoints.MapEndpoints());

            return builder;
        }

        public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration config)
        {
            var originsString = config.GetValue<string>("Cors:Origins");

            if (string.IsNullOrWhiteSpace(originsString))
            {
                return services;
            }

            var origins = originsString.Split(';', StringSplitOptions.RemoveEmptyEntries);

            services.AddCors(opt =>
                opt.AddPolicy("CleanArchitecture", policy =>
                    policy.AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .WithOrigins(origins)));

            return services;
        }

        public static IEndpointRouteBuilder MapEndpoints(this IEndpointRouteBuilder builder)
        {
            builder.MapControllers();
            builder.MapHealthCheck();

            return builder;
        }
    }
}