namespace Shared.Interfaces
{
    using System.Linq.Expressions;

    using Domain.Entities;

    public interface IRepository<TEntity> where TEntity : BaseAuditableEntity
    {
        IQueryable<TEntity> Query(bool asNoTracking = true);
        IQueryable<TEntity> AsNoTracking();
        IQueryable<TEntity> AsTracking();
        IQueryable<TEntity> GetAllIncludingDeleted();

        Task<TEntity?> GetByIdAsync(string id, bool asNoTracking = true, CancellationToken cancellationToken = default);
        Task<TEntity?> FirstOrDefaultAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<TEntity>> GetAllAsync(bool asNoTracking = true, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate, bool asNoTracking = true, CancellationToken cancellationToken = default);
        Task<bool> ExistsAsync(string id, CancellationToken cancellationToken = default);

        Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);
        Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default);
        void Update(TEntity entity);
        Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);
        Task DeleteAsync(TEntity entity, CancellationToken cancellationToken = default);

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}