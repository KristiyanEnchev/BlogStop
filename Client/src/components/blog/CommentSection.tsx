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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send } from 'lucide-react';

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
                    userId: user.id,
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

    const authorInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '';

    return (
        <div className="max-w-4xl mx-auto mt-16 text-light-text dark:text-dark-text">
            <div className="border-t border-light-bg-tertiary dark:border-dark-bg-tertiary pt-8 pb-4">
                <h3 className="text-2xl font-bold text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2 mb-8">
                    <MessageSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    Comments {data?.totalCount ? `(${data.totalCount})` : ''}
                </h3>

                <div id="comment-form" className="mb-10">
                    {user ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex gap-3">
                                <Avatar className="h-10 w-10 border-2 border-primary-100 dark:border-primary-900 flex-shrink-0">
                                    {user.profileImage ? (
                                        <AvatarImage src={user.profileImage} alt={user.name} />
                                    ) : (
                                        <AvatarFallback className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                                            {authorInitials}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                
                                <div className="flex-1 space-y-3">
                                    {replyTo && (
                                        <div className="flex items-center gap-2 text-sm text-light-text-muted dark:text-dark-text-muted">
                                            <span>Replying to comment</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0 text-sm hover:text-primary-600 dark:hover:text-primary-400"
                                                onClick={() => setReplyTo(null)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    )}
                                    
                                    <div className="relative">
                                        <Textarea
                                            placeholder="Write a comment..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={3}
                                            className="resize-none pr-12 bg-light-bg dark:bg-dark-bg border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-500 dark:focus:border-primary-400"
                                        />
                                        <Button 
                                            type="submit" 
                                            size="sm" 
                                            className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-full bg-primary-600 hover:bg-primary-700 text-white"
                                            disabled={isSubmitting || !comment.trim()}
                                        >
                                            <Send className="h-4 w-4" />
                                            <span className="sr-only">Submit</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-6 text-center shadow-sm">
                            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-primary-600 dark:text-primary-400 opacity-70" />
                            <h4 className="text-lg font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                Join the conversation
                            </h4>
                            <p className="text-light-text-muted dark:text-dark-text-muted mb-4 max-w-md mx-auto">
                                Sign in to share your thoughts and engage with other readers.
                            </p>
                            <Button asChild className="bg-primary-600 hover:bg-primary-700 text-white">
                                <Link to="/login">Log In</Link>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-4 shadow-sm space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-16 w-full" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-12 rounded-full" />
                                        <Skeleton className="h-6 w-14 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : data?.data.length === 0 ? (
                        <div className="rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary p-8 text-center shadow-sm">
                            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-light-text-muted dark:text-dark-text-muted opacity-50" />
                            <h4 className="text-lg font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
                                No comments yet
                            </h4>
                            <p className="text-light-text-muted dark:text-dark-text-muted">
                                Be the first to share your thoughts on this post!
                            </p>
                        </div>
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
                                <div className="flex justify-center pt-4">
                                    <Button 
                                        variant="outline" 
                                        onClick={handleLoadMore}
                                        className="border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                                    >
                                        Load More Comments
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
