namespace Persistence.Repositories
{
    using System.Linq.Expressions;

    using Microsoft.Extensions.Logging;
    using Microsoft.EntityFrameworkCore;

    using Domain.Events;
    using Domain.Entities;
    using Domain.Interfaces;

    using Persistence.Context;

    using Shared.Interfaces;

    public class Repository<TEntity> : IRepository<TEntity> where TEntity : BaseAuditableEntity
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<TEntity> _dbSet;
        protected readonly ILogger<Repository<TEntity>> _logger;
        protected readonly IDomainEventDispatcher _eventDispatcher;

        public Repository(
            ApplicationDbContext context,
            ILogger<Repository<TEntity>> logger,
            IDomainEventDispatcher eventDispatcher)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _dbSet = context.Set<TEntity>();
            _eventDispatcher = eventDispatcher ?? throw new ArgumentNullException(nameof(eventDispatcher));
        }

        public virtual IQueryable<TEntity> Query(bool asNoTracking = true)
        {
            var query = _dbSet.AsQueryable();
            return asNoTracking ? query.AsNoTracking() : query;
        }

        public virtual async Task<TEntity?> GetByIdAsync(string id, bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            try
            {
                if (asNoTracking)
                {
                    return await _dbSet.AsNoTracking()
                        .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
                }
                
                return await _dbSet.FindAsync(new object[] { id }, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting entity by id {Id}", id);
                throw;
            }
        }

        public virtual async Task<TEntity?> FirstOrDefaultAsync(
            Expression<Func<TEntity, bool>> predicate,
            bool asNoTracking = true,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var query = asNoTracking ? _dbSet.AsNoTracking() : _dbSet;
                return await query.FirstOrDefaultAsync(predicate, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting first entity with predicate");
                throw;
            }
        }

        public virtual async Task<IReadOnlyList<TEntity>> GetAllAsync(bool asNoTracking = true, CancellationToken cancellationToken = default)
        {
            try
            {
                var query = asNoTracking ? _dbSet.AsNoTracking() : _dbSet;
                return await query.ToListAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all entities");
                throw;
            }
        }

        public virtual async Task<IReadOnlyList<TEntity>> FindAsync(
            Expression<Func<TEntity, bool>> predicate,
            bool asNoTracking = true,
            CancellationToken cancellationToken = default)
        {
            try
            {
                var query = asNoTracking ? _dbSet.AsNoTracking() : _dbSet;
                return await query.Where(predicate).ToListAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while finding entities with predicate");
                throw;
            }
        }



        public virtual IQueryable<TEntity> AsNoTracking() => _dbSet.AsNoTracking();
        public virtual IQueryable<TEntity> AsTracking() => _dbSet.AsTracking();
        public virtual IQueryable<TEntity> GetAllIncludingDeleted() => _dbSet.IgnoreQueryFilters();

        public virtual async Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default)
        {
            try
            {
                var result = await _dbSet.AddAsync(entity, cancellationToken);
                entity.AddDomainEvent(EntityCreatedEvent.WithEntity(entity));
                return result.Entity;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding entity");
                throw;
            }
        }

        public virtual void Update(TEntity entity)
        {
            try
            {
                _dbSet.Update(entity);
                entity.AddDomainEvent(EntityUpdatedEvent.WithEntity(entity));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating entity");
                throw;
            }
        }
        
        // For backward compatibility
        public virtual Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default)
        {
            Update(entity);
            return Task.CompletedTask;
        }

        public async Task DeleteAsync(TEntity entity, CancellationToken cancellationToken = default)
        {
            try
            {
                if (entity is ISoftDelete)
                {
                    ((ISoftDelete)entity).IsDeleted = true;
                    await UpdateAsync(entity, cancellationToken);
                }
                else
                {
                    _dbSet.Remove(entity);
                }

                entity.AddDomainEvent(EntityDeletedEvent.WithEntity(entity));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting entity");
                throw;
            }
        }

        public virtual async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                int result = await _context.SaveChangesAsync(cancellationToken);
                return result;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency conflict detected while saving changes");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while saving changes");
                throw;
            }
        }

        public async Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default)
        {
            await _dbSet.AddRangeAsync(entities, cancellationToken);
        }

        public virtual async Task<bool> ExistsAsync(string id, CancellationToken cancellationToken = default)
        {
            return await _dbSet.AnyAsync(e => EF.Property<string>(e, "Id").Equals(id), cancellationToken);
        }
    }
}