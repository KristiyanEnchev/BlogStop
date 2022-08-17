import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationWrapperProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    disabled?: boolean;
}

export function PaginationWrapper({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
}: PaginationWrapperProps) {
    const maxPagesToShow = 5;

    const renderPageNumbers = () => {
        const pages = [];
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        for (let page = startPage; page <= endPage; page++) {
            pages.push(
                <PaginationItem key={page}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (!disabled) onPageChange(page);
                        }}
                        isActive={page === currentPage}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pages;
    };

    return (
        <Pagination>
            <PaginationContent>
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (!disabled) onPageChange(currentPage - 1);
                            }}
                        />
                    </PaginationItem>
                )}

                {currentPage > 3 && (
                    <>
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!disabled) onPageChange(1);
                                }}
                            >
                                1
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationEllipsis />
                    </>
                )}

                {renderPageNumbers()}

                {currentPage < totalPages - 2 && (
                    <>
                        <PaginationEllipsis />
                        <PaginationItem>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!disabled) onPageChange(totalPages);
                                }}
                            >
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}

                {currentPage < totalPages && (
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (!disabled) onPageChange(currentPage + 1);
                            }}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
