import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { BlogList } from '@/components/blog/BlogList';
import { useGetCategoriesQuery, useGetTagsQuery } from '@/services/blog/blogApi';
import { setCurrentCategory, setCurrentTag, setSearchTerm } from '@/services/blog/blogSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';

export default function BlogHomePage() {
    const dispatch = useAppDispatch();
    const { currentCategory, currentTag, searchTerm } = useAppSelector((state) => state.blog);
    const { user } = useAppSelector((state) => state.auth);
    const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm);

    const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
    const { data: tags, isLoading: tagsLoading } = useGetTagsQuery();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(setSearchTerm(localSearchTerm));
    };

    const handleCategoryClick = (category: string | null) => {
        dispatch(setCurrentCategory(category));
        if (category) dispatch(setCurrentTag(null));
    };

    const handleTagClick = (tag: string | null) => {
        dispatch(setCurrentTag(tag));
        if (tag) dispatch(setCurrentCategory(null));
    };

    const queryParams = {
        category: currentCategory || undefined,
        tag: currentTag || undefined,
        search: searchTerm || undefined,
    };

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <h1 className="text-3xl font-bold">Blog</h1>
                {user && (
                    <Button asChild>
                        <Link to="/create">
                            <i className="ri-add-line mr-1"></i> Create Post
                        </Link>
                    </Button>
                )}
            </div>

            <div className="grid gap-8 md:grid-cols-4">
                <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input
                                    placeholder="Search posts..."
                                    value={localSearchTerm}
                                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                                />
                                <Button type="submit" size="sm">
                                    <i className="ri-search-line"></i>
                                </Button>
                            </form>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Categories</h3>
                            {categoriesLoading ? (
                                <div className="space-y-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="h-6 w-full" />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant={!currentCategory ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => handleCategoryClick(null)}
                                    >
                                        All
                                    </Badge>
                                    {categories?.map((category) => (
                                        <Badge
                                            key={category.id}
                                            variant={currentCategory === category.name ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => handleCategoryClick(category.name)}
                                        >
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold">Popular Tags</h3>
                            {tagsLoading ? (
                                <div className="space-y-2">
                                    {[...Array(8)].map((_, i) => (
                                        <Skeleton key={i} className="h-6 w-3/4" />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {tags?.map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            variant={currentTag === tag.name ? "default" : "outline"}
                                            className="cursor-pointer text-xs"
                                            onClick={() => handleTagClick(tag.name)}
                                        >
                                            #{tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {(currentCategory || currentTag || searchTerm) && (
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={() => {
                                    dispatch(setCurrentCategory(null));
                                    dispatch(setCurrentTag(null));
                                    dispatch(setSearchTerm(''));
                                    setLocalSearchTerm('');
                                }}
                            >
                                <i className="ri-filter-off-line mr-1"></i> Clear Filters
                            </Button>
                        )}
                    </div>
                </div>

                <div className="md:col-span-3">
                    {searchTerm && (
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">
                                Search results for: <span className="italic">"{searchTerm}"</span>
                            </h2>
                        </div>
                    )}

                    {currentCategory && (
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">
                                Category: <span className="text-primary">{currentCategory}</span>
                            </h2>
                        </div>
                    )}

                    {currentTag && (
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">
                                Tag: <span className="text-primary">#{currentTag}</span>
                            </h2>
                        </div>
                    )}

                    <BlogList queryParams={queryParams} />
                </div>
            </div>
        </div>
    );
}
