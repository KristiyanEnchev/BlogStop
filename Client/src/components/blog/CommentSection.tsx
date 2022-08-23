import React from 'react';
import { useGetCommentsQuery, useCreateCommentMutation } from '@/services/blog/blogApi';
import { Comment as CommentType } from '@/types/blogTypes';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Comment } from './Comment';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
    postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
    const [page, setPage] = React.useState(1);
    const [comment, setComment] = React.useState('');
    const [replyTo, setReplyTo] = React.useState<string | null>(null);
    const { user } = useAppSelector((state) => state.auth);

    const { data, isLoading, refetch } = useGetCommentsQuery({
        postId,
        page,
        pageSize: 10
    });

    const [createComment, { isLoading: isSubmitting }] = useCreateCommentMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must be logged in to comment');
            return;
        }

        if (!comment.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        try {
            await createComment({
                postId,
                comment: {
                    content: comment,
                    // parentCommentId: replyTo,
                },
            }).unwrap();

            setComment('');
            setReplyTo(null);
            refetch();
            toast.success('Comment added successfully');
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    const handleReply = (commentId: string) => {
        setReplyTo(commentId);
        // Scroll to comment form
        document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleLoadMore = () => {
        if (data?.hasNextPage) {
            setPage(page + 1);
        }
    };

    return (
        <div className="space-y-6 text-light-text dark:text-dark-text">
            <h3 className="text-xl font-semibold text-light-text-secondary dark:text-dark-text-secondary">
                Comments {data?.totalCount ? `(${data.totalCount})` : ''}
            </h3>

            <div id="comment-form">
                {user ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            {replyTo && (
                                <div className="flex items-center gap-2 text-sm text-light-text-muted dark:text-dark-text-muted">
                                    <span>Replying to comment</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 text-sm"
                                        onClick={() => setReplyTo(null)}
                                    >
                                        <i className="ri-close-line mr-1"></i> Cancel
                                    </Button>
                                </div>
                            )}
                            <Textarea
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <i className="ri-loader-4-line mr-2 animate-spin"></i>}
                                {replyTo ? 'Reply' : 'Comment'}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="rounded-md border border-light-bg-tertiary dark:border-dark-bg-tertiary p-4 text-center">
                        <p className="text-light-text-muted dark:text-dark-text-muted">
                            You need to be logged in to comment.
                        </p>
                        <Button asChild className="mt-2" variant="outline">
                            <Link to="/login">Log In</Link>
                        </Button>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-16 w-full" />
                            </div>
                        ))}
                    </div>
                ) : data?.data.length === 0 ? (
                    <p className="text-center text-light-text-muted dark:text-dark-text-muted">No comments yet. Be the first to comment!</p>
                ) : (
                    <>
                        {data?.data.map((comment: CommentType) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                onReply={handleReply}
                                postId={postId}
                            />
                        ))}

                        {data?.hasNextPage && (
                            <div className="flex justify-center">
                                <Button variant="outline" onClick={handleLoadMore}>
                                    Load More Comments
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
