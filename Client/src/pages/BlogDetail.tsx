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
import { Calendar, Heart, Clock, Edit, Trash2, Share2, ArrowLeft, Tag as TagIcon, Bookmark, MessageSquare } from 'lucide-react';

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
            }).catch(_err => {
                toast.error('Failed to share');
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard');
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Button
                    asChild
                    variant="ghost"
                    className="text-light-text-muted dark:text-dark-text-muted hover:text-light-text-secondary dark:hover:text-dark-text-secondary mb-8 -ml-2"
                >
                    <Link to="/" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-8">
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

                    <div className="lg:col-span-1">
                        <div className="space-y-8">
                            <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm space-y-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-16 w-16 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <Skeleton className="h-20 w-full" />
                            </div>

                            <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm space-y-4">
                                <Skeleton className="h-5 w-24" />
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-8 w-20 rounded-full" />
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                    <Skeleton className="h-8 w-16 rounded-full" />
                                </div>
                            </div>

                            <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm space-y-4">
                                <Skeleton className="h-5 w-24" />
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-6 w-14 rounded-full" />
                                </div>
                            </div>

                            <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm space-y-4">
                                <Skeleton className="h-5 w-24" />
                                <div className="grid grid-cols-2 gap-2">
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
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
        <div className="container mx-auto py-8 px-4">
            <Button
                asChild
                variant="ghost"
                className="text-light-text-muted dark:text-dark-text-muted hover:text-light-text-secondary dark:hover:text-dark-text-secondary mb-8 -ml-2"
            >
                <Link to="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Blog
                </Link>
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
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
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-light-text-secondary dark:text-dark-text-secondary leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex items-center gap-4 text-sm text-light-text-muted dark:text-dark-text-muted lg:hidden">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" /> {formatDate(post.createdDate)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" /> {readingTime}
                                </div>
                            </div>
                        </header>

                        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-light-text-secondary dark:prose-headings:text-dark-text-secondary prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: post.content }} />
                    </article>
                </div>

                <div className="lg:col-span-1">
                    <div className="space-y-8">
                        {/* Author Card */}
                        <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <Avatar className="h-20 w-20 border-2 border-primary-200 dark:border-primary-800">
                                    {post.authorImage ? (
                                        <AvatarImage src={post.authorImage} alt={post.authorName} />
                                    ) : (
                                        <AvatarFallback className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-xl">
                                            {authorInitials}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div>
                                    <div className="font-bold text-lg text-light-text-secondary dark:text-dark-text-secondary">
                                        {post.authorName}
                                    </div>
                                    <div className="text-sm text-light-text-muted dark:text-dark-text-muted">
                                        Author
                                    </div>
                                </div>
                                <p className="text-sm text-light-text-muted dark:text-dark-text-muted">
                                    Content creator passionate about sharing knowledge and insights on various topics.
                                </p>
                            </div>
                        </div>

                        {/* Post Info */}
                        <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm space-y-4">
                            <h3 className="font-medium text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary-600 dark:text-primary-400" /> Post Info
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-light-text-muted dark:text-dark-text-muted">Published</span>
                                    <span className="text-light-text-secondary dark:text-dark-text-secondary">{formatDate(post.createdDate)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-light-text-muted dark:text-dark-text-muted">Reading time</span>
                                    <span className="text-light-text-secondary dark:text-dark-text-secondary">{readingTime}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-light-text-muted dark:text-dark-text-muted">Views</span>
                                    <span className="text-light-text-secondary dark:text-dark-text-secondary">{post.viewCount}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-light-text-muted dark:text-dark-text-muted">Likes</span>
                                    <span className="text-light-text-secondary dark:text-dark-text-secondary">{post.numberOfLikes}</span>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm space-y-4">
                            <h3 className="font-medium text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2">
                                <Bookmark className="h-4 w-4 text-primary-600 dark:text-primary-400" /> Categories
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {post.categories.map((category) => (
                                    <Badge
                                        key={category}
                                        variant="secondary"
                                        className="bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm space-y-4">
                            <h3 className="font-medium text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2">
                                <TagIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" /> Tags
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm space-y-4">
                            <h3 className="font-medium text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary-600 dark:text-primary-400" /> Actions
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={post.isLikedByUser ? "default" : "outline"}
                                    size="sm"
                                    onClick={handleLikeToggle}
                                    className={post.isLikedByUser ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800" : "text-light-text dark:text-dark-text"}
                                >
                                    <Heart className={`h-4 w-4 mr-1 ${post.isLikedByUser ? "fill-red-800 dark:fill-red-300" : ""}`} />
                                    Like
                                </Button>

                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handleShare}
                                    className="text-light-text dark:text-dark-text"
                                >
                                    <Share2 className="h-4 w-4 mr-1" /> Share
                                </Button>
                            </div>
                        </div>
                        {isAuthor && (
                            <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 shadow-sm space-y-4">
                                <h3 className="font-medium text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-primary-600 dark:text-primary-400" /> Author Actions
                                </h3>

                                {isAuthor && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        asChild
                                        className="text-light-text dark:text-dark-text"
                                    >
                                        <Link to={`/edit/${post.id}`}>
                                            <Edit className="h-4 w-4 mr-1" /> Edit
                                        </Link>
                                    </Button>
                                )}

                                {isAuthor && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="ml-2 text-light-text dark:text-dark-text"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
