import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetBlogPostByIdQuery, useToggleLikeBlogPostMutation, useDeleteBlogPostMutation } from '@/services/blog/blogApi';
import { formatDate } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Eye, Heart, Clock, Edit, Trash2, Share2, BookmarkPlus, ArrowLeft } from 'lucide-react';

export default function BlogDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [readingTime, setReadingTime] = React.useState('');
    
    const { data: post, isLoading, refetch } = useGetBlogPostByIdQuery(id || '');
    const [toggleLike] = useToggleLikeBlogPostMutation();
    const [deletePost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();

    React.useEffect(() => {
        if (post?.content) {
            const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
            const time = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
            setReadingTime(`${time} min read`);
        }
    }, [post]);

    const handleLikeToggle = async () => {
        if (!user) {
            toast.error('You must be logged in to like posts');
            return;
        }

        if (post) {
            await toggleLike(post.id);
            refetch();
        }
    };

    const handleDelete = async () => {
        if (post) {
            try {
                await deletePost(post.id).unwrap();
                toast.success('Post deleted successfully');
                navigate('/');
            } catch (error) {
                toast.error('Failed to delete post');
            }
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post?.title,
                url: window.location.href,
            }).catch(err => {
                toast.error('Failed to share');
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto py-8 space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-[400px] w-full rounded-xl" />
                <div className="space-y-4 mt-8">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center text-light-text dark:text-dark-text">
                <h2 className="text-3xl font-bold text-light-text-secondary dark:text-dark-text-secondary mb-4">Post not found</h2>
                <p className="text-light-text-muted dark:text-dark-text-muted mb-8 max-w-md">
                    The post you're looking for doesn't exist or has been removed.
                </p>
                <Button asChild variant="outline" className="gap-2">
                    <Link to="/">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>
                </Button>
            </div>
        );
    }

    const isAuthor = user?.id === post.authorId;
    const authorInitials = post.authorName.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-6">
                <Button 
                    asChild 
                    variant="ghost" 
                    className="text-light-text-muted dark:text-dark-text-muted hover:text-light-text-secondary dark:hover:text-dark-text-secondary mb-4 -ml-2"
                >
                    <Link to="/" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>
                </Button>
            </div>

            <article className="space-y-8 text-light-text dark:text-dark-text">
                {post.featuredImage && (
                    <div className="overflow-hidden rounded-xl shadow-md">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="h-auto w-full object-cover max-h-[500px]"
                        />
                    </div>
                )}

                <header className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {post.categories.map((category) => (
                            <Badge key={category} variant="secondary" className="bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50 border-primary-200 dark:border-primary-800">
                                {category}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-light-text-secondary dark:text-dark-text-secondary leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-light-bg-tertiary dark:border-dark-bg-tertiary">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border-2 border-primary-200 dark:border-primary-800">
                                {post.authorImage ? (
                                    <AvatarImage src={post.authorImage} alt={post.authorName} />
                                ) : (
                                    <AvatarFallback className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                                        {authorInitials}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <div className="font-medium text-light-text-secondary dark:text-dark-text-secondary">
                                    {post.authorName}
                                </div>
                                <div className="text-sm text-light-text-muted dark:text-dark-text-muted flex items-center gap-1">
                                    <Calendar className="h-3 w-3" /> {formatDate(post.createdDate)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-light-text-muted dark:text-dark-text-muted">
                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" /> {post.viewCount}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {readingTime}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-light-text-secondary dark:prose-headings:text-dark-text-secondary prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content }} />

                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-light-bg-tertiary dark:border-dark-bg-tertiary">
                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            variant={post.isLikedByUser ? "default" : "outline"}
                            size="sm"
                            onClick={handleLikeToggle}
                            className={post.isLikedByUser ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800" : ""}
                        >
                            <Heart className={`h-4 w-4 mr-1 ${post.isLikedByUser ? "fill-red-800 dark:fill-red-300" : ""}`} />
                            {post.numberOfLikes}
                        </Button>

                        <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="h-4 w-4 mr-1" /> Share
                        </Button>

                        <Button variant="outline" size="sm">
                            <BookmarkPlus className="h-4 w-4 mr-1" /> Save
                        </Button>
                    </div>

                    {isAuthor && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link to={`/edit/${post.id}`}>
                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                </Link>
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-light-bg-tertiary dark:border-dark-bg-tertiary">
                    <h3 className="text-lg font-medium mb-3 text-light-text-secondary dark:text-dark-text-secondary">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </article>

            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                title="Delete Post"
                description="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
