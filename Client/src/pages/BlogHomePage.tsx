import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { BlogList } from '@/components/blog/BlogList';
import { useGetCategoriesQuery, useGetTagsQuery, useGetBlogPostsQuery } from '@/services/blog/blogApi';
import { setCurrentCategory, setCurrentTag, setSearchTerm } from '@/services/blog/blogSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Tag, Filter, X } from 'lucide-react';
import { BlogPost } from '@/types/blogTypes';
import { BlogCard } from '@/components/blog/BlogCard';

export default function BlogHomePage() {
    const dispatch = useAppDispatch();
    const { currentCategory, currentTag, searchTerm } = useAppSelector((state) => state.blog);
    const { user } = useAppSelector((state) => state.auth);
    const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm);
    const [filteredPosts, setFilteredPosts] = React.useState<BlogPost[] | null>(null);

    const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
    const { data: tags, isLoading: tagsLoading } = useGetTagsQuery();
    
    const queryParams = {
        category: currentCategory || undefined,
        tag: currentTag || undefined,
        sortBy: "CreatedDate" as const,
        order: "desc" as const,
    };
    
    const { data: blogPostsData, isLoading: blogPostsLoading } = useGetBlogPostsQuery(queryParams);

    React.useEffect(() => {
        if (blogPostsData?.data && searchTerm) {
            const filtered = blogPostsData.data.filter(post => 
                post.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPosts(filtered);
        } else {
            setFilteredPosts(null);
        }
    }, [blogPostsData, searchTerm]);

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

    return (
        <div className="container mx-auto py-12 text-light-text dark:text-dark-text">
            <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-4xl font-bold text-light-text-secondary dark:text-dark-text-secondary">
                        Blog<span className="text-primary-600 dark:text-primary-400">Corner</span>
                    </h1>
                    
                    <form onSubmit={handleSearch} className="relative md:flex-1 md:max-w-md">
                        <Input
                            placeholder="Search articles..."
                            value={localSearchTerm}
                            onChange={(e) => setLocalSearchTerm(e.target.value)}
                            className="h-10 pl-10 pr-4 rounded-full border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary focus:ring-2 focus:ring-primary-500"
                        />
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted" />
                        <Button 
                            type="submit" 
                            size="sm" 
                            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 p-0 bg-primary-600 hover:bg-primary-700"
                        >
                            <Search className="h-3 w-3 text-white" />
                        </Button>
                    </form>
                    
                    {user && (
                        <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white whitespace-nowrap">
                            <Link to="/create" className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" /> Create Post
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-4">
                <div className="md:col-span-1">
                    <div className="sticky top-24 space-y-8 rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm">
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-light-text-secondary dark:text-dark-text-secondary">
                                <Filter className="h-5 w-5 text-primary-600 dark:text-primary-400" /> Categories
                            </h3>
                            {categoriesLoading ? (
                                <div className="space-y-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} className="h-8 w-full" />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    <Badge
                                        variant={!currentCategory ? "default" : "outline"}
                                        className="cursor-pointer px-3 py-1 text-sm"
                                        onClick={() => handleCategoryClick(null)}
                                    >
                                        All
                                    </Badge>
                                    {categories?.map((category) => (
                                        <Badge
                                            key={category.id}
                                            variant={currentCategory === category.name ? "default" : "outline"}
                                            className="cursor-pointer px-3 py-1 text-sm"
                                            onClick={() => handleCategoryClick(category.name)}
                                        >
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-light-text-secondary dark:text-dark-text-secondary">
                                <Tag className="h-5 w-5 text-primary-600 dark:text-primary-400" /> Popular Tags
                            </h3>
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
                                            variant={currentTag === tag.name ? "secondary" : "outline"}
                                            className={`cursor-pointer text-xs ${
                                                currentTag === tag.name 
                                                ? 'bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50' 
                                                : ''
                                            }`}
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
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2 border-dashed"
                                onClick={() => {
                                    dispatch(setCurrentCategory(null));
                                    dispatch(setCurrentTag(null));
                                    dispatch(setSearchTerm(''));
                                    setLocalSearchTerm('');
                                }}
                            >
                                <X className="h-4 w-4" /> Clear All Filters
                            </Button>
                        )}
                    </div>
                </div>

                <div className="md:col-span-3">
                    {(searchTerm || currentCategory || currentTag) && (
                        <div className="mb-6 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary p-4 shadow-sm">
                            <h2 className="text-xl font-bold text-light-text-secondary dark:text-dark-text-secondary">
                                {searchTerm && (
                                    <span>
                                        Search results for: <span className="text-primary-600 dark:text-primary-400">"{searchTerm}"</span>
                                    </span>
                                )}
                                {currentCategory && (
                                    <span>
                                        Category: <span className="text-primary-600 dark:text-primary-400">{currentCategory}</span>
                                    </span>
                                )}
                                {currentTag && (
                                    <span>
                                        Tag: <span className="text-primary-600 dark:text-primary-400">#{currentTag}</span>
                                    </span>
                                )}
                            </h2>
                        </div>
                    )}

                    {filteredPosts ? (
                        filteredPosts.length > 0 ? (
                            <div className="space-y-8">
                                <div className="grid gap-8 md:grid-cols-2">
                                    {filteredPosts.map((post) => (
                                        <BlogCard key={post.id} post={post} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-12 text-center shadow-sm">
                                <Search className="h-16 w-16 text-light-text-muted dark:text-dark-text-muted mb-4" />
                                <h3 className="text-2xl font-bold text-light-text-secondary dark:text-dark-text-secondary mb-2">No matching posts</h3>
                                <p className="text-light-text-muted dark:text-dark-text-muted max-w-md">
                                    We couldn't find any blog posts with titles matching "{searchTerm}". Try a different search term.
                                </p>
                            </div>
                        )
                    ) : (
                        <BlogList queryParams={queryParams} />
                    )}
                </div>
            </div>
        </div>
    );
}
