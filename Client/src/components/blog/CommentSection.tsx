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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, ArrowUp } from 'lucide-react';

interface CommentSectionProps {
    postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
    const [page, setPage] = React.useState(1);
    const [comment, setComment] = React.useState('');
    const [replyTo, setReplyTo] = React.useState<string | null>(null);
    const { user } = useAppSelector((state) => state.auth);
    const { data, isLoading, refetch } = useGetCommentsQuery({ postId, page, pageSize: 10 });
    const [createComment, { isLoading: isSubmitting }] = useCreateCommentMutation();
    const commentListRef = React.useRef<HTMLDivElement>(null);

    const handleReply = (commentId: string) => {
        setReplyTo(commentId);
        document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
    };

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
                    parentCommentId: replyTo || undefined,
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

    const handleLoadMore = () => {
        if (data?.hasNextPage) {
            setPage(page + 1);
        }
    };

    const authorInitials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '';

    return (
        <div className="max-w-6xl mx-auto mt-16 text-light-text dark:text-dark-text">
            <div className="border-t border-light-bg-tertiary dark:border-dark-bg-tertiary pt-8 pb-4">
                <h3 className="text-2xl font-bold text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2 mb-8">
                    <MessageSquare className="h-6 w-6" />
                    <span>Comments</span>
                    <span className="text-lg font-normal text-light-text-muted dark:text-dark-text-muted">({data?.totalCount || 0})</span>
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Comment Form - Sticky on larger screens */}
                    <div className="order-2 lg:order-1 lg:col-span-1">
                        <div className="lg:sticky lg:top-24">
                            <div id="comment-form" className="bg-light-bg-secondary dark:bg-dark-bg-secondary p-5 rounded-xl shadow-sm">
                                <h4 className="font-medium text-light-text-secondary dark:text-dark-text-secondary mb-4">
                                    {replyTo ? 'Reply to comment' : 'Join the conversation'}
                                </h4>

                                {replyTo && (
                                    <div className="mb-3 flex justify-between items-center">
                                        <div className="text-sm text-primary-600 dark:text-primary-400">
                                            Replying to a comment
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setReplyTo(null)}
                                            className="text-light-text-muted dark:text-dark-text-muted hover:text-primary-600 dark:hover:text-primary-400 h-7 px-2"
                                        >
                                            Cancel reply
                                        </Button>
                                    </div>
                                )}

                                {user ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="flex gap-3">
                                            <Avatar className="h-8 w-8 border-2 border-primary-100 dark:border-primary-900 flex-shrink-0">
                                                <AvatarFallback className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-xs">
                                                    {authorInitials}
                                                </AvatarFallback>
                                            </Avatar>
                                            
                                            <div className="flex-1 space-y-3">
                                                <Textarea
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder="Write a comment..."
                                                    className="resize-none min-h-[100px]"
                                                />
                                                <div className="flex justify-end">
                                                    <Button 
                                                        type="submit" 
                                                        disabled={isSubmitting || !comment.trim()}
                                                        className="bg-primary-600 hover:bg-primary-700 text-white"
                                                    >
                                                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                                                        <Send className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="bg-light-bg dark:bg-dark-bg rounded-lg p-4 text-center">
                                        <p className="mb-3 text-light-text-muted dark:text-dark-text-muted">
                                            Sign in to join the conversation
                                        </p>
                                        <Link to="/login">
                                            <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                                                Sign In
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Quick scroll to top button - visible only on mobile */}
                            <div className="mt-4 lg:hidden flex justify-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="rounded-full h-10 w-10 p-0 border-primary-200 dark:border-primary-800"
                                >
                                    <ArrowUp className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="order-1 lg:order-2 lg:col-span-2" ref={commentListRef}>
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
                                    {data?.data
                                        .filter(comment => !comment.parentCommentId)
                                        .map((comment: CommentType) => (
                                            <Comment
                                                key={comment.id}
                                                comment={comment}
                                                onReply={handleReply}
                                                postId={postId}
                                                replies={data.data}
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
            </div>
        </div>
    );
}
