import { BlogPost } from '@/types/blogTypes';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface BlogCardProps {
    post: BlogPost;
    compact?: boolean;
}

export function BlogCard({ post, compact = false }: BlogCardProps) {
    return (
        <Card className="h-full overflow-hidden transition-all hover:shadow-md">
            <Link to={`/${post.id}`}>
                {!compact && post.featuredImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        {post.isFeatured && (
                            <Badge className="absolute right-2 top-2 bg-primary-600 dark:bg-primary-500 text-white">
                                Featured
                            </Badge>
                        )}
                    </div>
                )}
                <CardHeader className="p-4 pb-0">
                    <div className="flex items-center gap-2 text-sm text-light-text-muted dark:text-dark-text-muted">
                        <span>{formatDate(post.createdDate)}</span>
                        <span>•</span>
                        <span>{post.authorName}</span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-xl font-semibold tracking-tight text-light-text-secondary dark:text-dark-text-secondary">
                        {post.title}
                    </h3>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <p className="line-clamp-3 text-light-text-muted dark:text-dark-text-muted">
                        {post.excerpt}
                    </p>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
                    {post.categories.slice(0, 2).map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                            {category}
                        </Badge>
                    ))}
                    <div className="ml-auto flex items-center gap-2 text-sm text-light-text-muted dark:text-dark-text-muted">
                        <span className="flex items-center gap-1">
                            <i className="ri-eye-line"></i> {post.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <i className="ri-heart-line"></i> {post.numberOfLikes}
                        </span>
                    </div>
                </CardFooter>
            </Link>
        </Card>
    );
}
