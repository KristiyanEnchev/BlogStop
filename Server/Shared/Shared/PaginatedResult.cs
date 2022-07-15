namespace Shared
{
    public class PaginatedResult<T>
    {
        public bool Success { get; set; } = true;
        public List<T> Data { get; set; } = new List<T>();
        public List<string> Errors { get; set; } = new List<string>();
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public bool HasPreviousPage => CurrentPage > 1;
        public bool HasNextPage => CurrentPage < TotalPages;

        public PaginatedResult() { }

        public PaginatedResult(List<T> data, int totalCount, int currentPage, int pageSize)
        {
            Success = true;
            Data = data ?? new List<T>();
            TotalCount = totalCount;
            CurrentPage = currentPage;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
        }

        public static PaginatedResult<T> Create(List<T> data, int totalCount, int currentPage, int pageSize)
        {
            return new PaginatedResult<T>(data, totalCount, currentPage, pageSize);
        }

        public static PaginatedResult<T> Failure(List<string> errors)
        {
            return new PaginatedResult<T>
            {
                Success = false,
                Errors = errors,
                Data = new List<T>(),
                TotalCount = 0,
                TotalPages = 0,
                CurrentPage = 0,
                PageSize = 0
            };
        }

        public static PaginatedResult<T> Empty(int pageSize)
        {
            return new PaginatedResult<T>
            {
                Success = true,
                Data = new List<T>(),
                TotalCount = 0,
                TotalPages = 0,
                CurrentPage = 1,
                PageSize = pageSize
            };
        }
    }
}