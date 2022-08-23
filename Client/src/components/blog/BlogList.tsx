import React from 'react';
import { BlogCard } from './BlogCard';
import { BlogQueryParams } from '@/types/blogTypes';
import { useGetBlogPostsQuery } from '@/services/blog/blogApi';
import { Skeleton } from '@/components/ui/skeleton';
import { PaginationWrapper } from '@/components/common/PaginationWrapper';

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
    console.log(data)
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data?.data?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-xl font-semibold">No posts found</h3>
                <p className="text-muted-foreground">
                    Try changing your search criteria or check back later.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.data.map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>

            {showPagination && data.totalPages > 1 && (
                <PaginationWrapper
                    currentPage={page}
                    totalPages={data.totalPages}
                    onPageChange={handlePageChange}
                    disabled={isFetching}
                />
            )}
        </div>
    );
}
