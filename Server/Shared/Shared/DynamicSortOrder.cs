namespace Shared
{
    using System.Reflection;
    using System.Linq.Expressions;
    using System.Collections.Concurrent;

    public class DynamicSortOrder<T> : SortOrder<T>
    {
        private static readonly ConcurrentDictionary<string, Expression<Func<T, object>>> ExpressionCache =
            new ConcurrentDictionary<string, Expression<Func<T, object>>>();

        public DynamicSortOrder(string? sortBy, string? order) : base(sortBy, order) { }

        public override Expression<Func<T, object>> ToExpression()
        {
            if (string.IsNullOrWhiteSpace(SortBy))
                return x => x;

            string cacheKey = $"{typeof(T).FullName}_{SortBy}";
            return ExpressionCache.GetOrAdd(cacheKey, _ => BuildExpression());
        }

        private Expression<Func<T, object>> BuildExpression()
        {
            var param = Expression.Parameter(typeof(T), "x");
            var property = typeof(T).GetProperty(SortBy, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

            if (property == null)
                throw new ArgumentException($"Property {SortBy} not found on {typeof(T).Name}");

            var propertyAccess = Expression.Property(param, property);
            var converted = Expression.Convert(propertyAccess, typeof(object));
            return Expression.Lambda<Func<T, object>>(converted, param);
        }
    }
}