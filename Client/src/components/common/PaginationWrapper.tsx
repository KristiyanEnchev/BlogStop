import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
                        className={page === currentPage ? 
                            "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-800 dark:hover:bg-primary-700" : 
                            "hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                        }
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pages;
    };

    return (
        <Pagination className="flex justify-center">
            <PaginationContent className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg shadow-sm p-1">
                {currentPage > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (!disabled) onPageChange(currentPage - 1);
                            }}
                            className="hover:bg-light-bg dark:hover:bg-dark-bg hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label="Go to previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Previous</span>
                        </PaginationPrevious>
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
                                className="hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
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
                                className="hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
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
                            className="hover:bg-light-bg dark:hover:bg-dark-bg hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label="Go to next page"
                        >
                            <span className="sr-only md:not-sr-only md:mr-2">Next</span>
                            <ChevronRight className="h-4 w-4" />
                        </PaginationNext>
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
