import { BlogPost } from '@/types/blogTypes';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Eye, Heart, Star } from 'lucide-react';

interface BlogCardProps {
    post: BlogPost;
    compact?: boolean;
}

export function BlogCard({ post, compact = false }: BlogCardProps) {
    return (
        <Card className="group h-full overflow-hidden border-0 bg-light-bg-secondary dark:bg-dark-bg-secondary transition-all hover:shadow-lg">
            <Link to={`/${post.id}`} className="flex h-full flex-col">
                {!compact && post.featuredImage && (
                    <div className="relative h-56 w-full overflow-hidden">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {post.isFeatured && (
                            <div className="absolute left-0 top-4 bg-primary-600 px-3 py-1 text-white shadow-md">
                                <Star className="mr-1 inline-block h-4 w-4" /> Featured
                            </div>
                        )}
                    </div>
                )}
                <CardHeader className="p-5 pb-0">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {post.categories.slice(0, 2).map((category) => (
                            <Badge key={category} variant="secondary" className="text-xs font-medium">
                                {category}
                            </Badge>
                        ))}
                    </div>
                    <h3 className="mt-1 line-clamp-2 text-xl font-bold tracking-tight text-light-text-secondary dark:text-dark-text-secondary group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {post.title}
                    </h3>
                </CardHeader>
                <CardContent className="flex-grow p-5 pt-3">
                    <p className="line-clamp-3 text-light-text-muted dark:text-dark-text-muted">
                        {post.excerpt}
                    </p>
                </CardContent>
                <CardFooter className="border-t border-light-border dark:border-dark-border flex items-center justify-between p-5">
                    <div className="flex items-center gap-2 text-sm text-light-text-muted dark:text-dark-text-muted">
                        <span className="font-medium">{post.authorName}</span>
                        <span className="text-light-text-muted/50 dark:text-dark-text-muted/50">•</span>
                        <span>{formatDate(post.createdDate)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-light-text-muted dark:text-dark-text-muted">
                        <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" /> {post.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" /> {post.numberOfLikes}
                        </span>
                    </div>
                </CardFooter>
            </Link>
        </Card>
    );
}
