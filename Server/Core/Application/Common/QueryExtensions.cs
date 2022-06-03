namespace Application.Common
{
    using System.Reflection;
    using System.Linq.Expressions;

    using Microsoft.EntityFrameworkCore;

    using Shared;

    public static class QueryExtensions
    {
        public static Expression<Func<T, object>> GetSortExpression<T>(string sortBy)
        {
            var param = Expression.Parameter(typeof(T), "x");
            var property = typeof(T).GetProperty(sortBy, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

            if (property == null)
                throw new ArgumentException($"Property {sortBy} not found on {typeof(T).Name}");

            var propertyAccess = Expression.Property(param, property);
            var converted = Expression.Convert(propertyAccess, typeof(object));

            return Expression.Lambda<Func<T, object>>(converted, param);
        }

        public static IQueryable<T> Sort<T>(this IQueryable<T> query, string? sortBy)
        {
            if (string.IsNullOrEmpty(sortBy)) return query;

            var sortExpression = GetSortExpression<T>(sortBy);
            return query.OrderBy(sortExpression);
        }

        public static IQueryable<T> Order<T>(this IQueryable<T> query, string? sortBy, string? order)
        {
            if (string.IsNullOrEmpty(sortBy)) return query;

            var sortExpression = GetSortExpression<T>(sortBy);
            return order?.ToLower() == "desc" ? query.OrderByDescending(sortExpression) : query.OrderBy(sortExpression);
        }

        public static async Task<PaginatedResult<T>> ToPaginatedListAsync<T>(this IQueryable<T> query, int page, int pageSize)
        {
            var totalCount = await query.CountAsync();
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return PaginatedResult<T>.Create(items, totalCount, page, pageSize);
        }
    }
}
