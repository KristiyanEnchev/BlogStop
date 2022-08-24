import React from 'react';
import { BlogCard } from './BlogCard';
import { BlogQueryParams } from '@/types/blogTypes';
import { useGetBlogPostsQuery } from '@/services/blog/blogApi';
import { Skeleton } from '@/components/ui/skeleton';
import { PaginationWrapper } from '@/components/common/PaginationWrapper';
import { FileQuestion } from 'lucide-react';

interface BlogListProps {
    queryParams?: BlogQueryParams;
    showPagination?: boolean;
}

export function BlogList({ queryParams = {}, showPagination = true }: BlogListProps) {
    const [page, setPage] = React.useState(queryParams.page || 1);
    const finalQueryParams: BlogQueryParams = {
        ...queryParams,
        page,
        sortBy: queryParams.sortBy || "CreatedDate",
        order: queryParams.order || "desc",
    };

    const { data, isLoading, isFetching } = useGetBlogPostsQuery(finalQueryParams);
    
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3 rounded-xl overflow-hidden bg-light-bg-secondary dark:bg-dark-bg-secondary p-4">
                        <Skeleton className="h-56 w-full rounded-lg" />
                        <div className="space-y-2 p-2">
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-24 w-full" />
                            <div className="flex justify-between pt-4">
                                <Skeleton className="h-6 w-32" />
                                <div className="flex gap-3">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data?.data?.length) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-12 text-center shadow-sm">
                <FileQuestion className="h-16 w-16 text-light-text-muted dark:text-dark-text-muted mb-4" />
                <h3 className="text-2xl font-bold text-light-text-secondary dark:text-dark-text-secondary mb-2">No posts found</h3>
                <p className="text-light-text-muted dark:text-dark-text-muted max-w-md">
                    We couldn't find any blog posts matching your criteria. Try adjusting your filters or check back later for new content.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                {data.data.map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>

            {showPagination && data.totalPages > 1 && (
                <div className="mt-12">
                    <PaginationWrapper
                        currentPage={page}
                        totalPages={data.totalPages}
                        onPageChange={handlePageChange}
                        disabled={isFetching}
                    />
                </div>
            )}
        </div>
    );
}
