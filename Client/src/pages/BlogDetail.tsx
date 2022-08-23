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

export default function BlogDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    
    const { data: post, isLoading, refetch } = useGetBlogPostByIdQuery(id || '');
    const [toggleLike] = useToggleLikeBlogPostMutation();
    const [deletePost, { isLoading: isDeleting }] = useDeleteBlogPostMutation();

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

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-3/4" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-64 w-full" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-light-text dark:text-dark-text">
                <h2 className="text-2xl font-bold text-light-text-secondary dark:text-dark-text-secondary">Post not found</h2>
                <p className="text-light-text-muted dark:text-dark-text-muted">
                    The post you're looking for doesn't exist or has been removed.
                </p>
                <Button asChild className="mt-4">
                    <Link to="/">Back to Blog</Link>
                </Button>
            </div>
        );
    }

    const isAuthor = user?.id === post.authorId;

    return (
        <article className="mx-auto max-w-4xl space-y-8 text-light-text dark:text-dark-text">
            <header className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-light-text-secondary dark:text-dark-text-secondary">{post.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-light-text-muted dark:text-dark-text-muted">
                    <span>{formatDate(post.createdDate)}</span>
                    <span>•</span>
                    <span>{post.authorName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <i className="ri-eye-line"></i> {post.viewCount} views
                    </span>
                </div>

                {post.featuredImage && (
                    <div className="overflow-hidden rounded-lg">
                        <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="h-auto w-full object-cover"
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {post.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="text-sm">
                            {category}
                        </Badge>
                    ))}
                </div>
            </header>

            <div className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="flex flex-wrap items-center gap-4 border-t border-b border-light-bg-tertiary dark:border-dark-bg-tertiary py-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant={post.isLikedByUser ? "default" : "outline"}
                        size="sm"
                        onClick={handleLikeToggle}
                    >
                        <i className={`ri-heart-${post.isLikedByUser ? 'fill' : 'line'} mr-1`}></i>
                        {post.numberOfLikes} {post.numberOfLikes === 1 ? 'Like' : 'Likes'}
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                        </Badge>
                    ))}
                </div>

                {isAuthor && (
                    <div className="ml-auto flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link to={`/edit/${post.id}`}>
                                <i className="ri-edit-line mr-1"></i> Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <i className="ri-delete-bin-line mr-1"></i> Delete
                        </Button>
                    </div>
                )}
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

        </article>
    );
}
