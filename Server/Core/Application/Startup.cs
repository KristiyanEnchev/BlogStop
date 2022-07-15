namespace Application
{
    using System.Reflection;

    using Microsoft.Extensions.DependencyInjection;

    using FluentValidation;

    using MediatR;

    using Application.Common.Behaviours;
    using Application.Common.Mappings;

    using Models;

    using Domain.Entities.Blog;

    using Shared.Mappings;

    public static class Startup
    {
        public static void AddApplication(this IServiceCollection services)
        {
            services.AddMapperConfig();
            services.AddValidators();
            services.AddMediator();
        }

        private static IServiceCollection AddMapperConfig(this IServiceCollection services)
        {
            services.AddMappings(
                typeof(BaseDto<,>).Assembly, 
                typeof(BlogPost).Assembly,    
                typeof(IMapFrom<>).Assembly,
                Assembly.GetExecutingAssembly());

            return services;
        }

        private static void AddValidators(this IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        }

        private static void AddMediator(this IServiceCollection services)
        {
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
            });
        }
    }
}