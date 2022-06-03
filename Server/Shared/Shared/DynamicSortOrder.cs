namespace Shared
{
    using System.Reflection;
    using System.Linq.Expressions;

    public class DynamicSortOrder<T> : SortOrder<T>
    {
        public DynamicSortOrder(string? sortBy, string? order) : base(sortBy, order) { }

        public override Expression<Func<T, object>> ToExpression()
        {
            if (string.IsNullOrWhiteSpace(SortBy))
                return x => x;

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