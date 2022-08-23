import React from 'react';
import { Comment as CommentType } from '@/types/blogTypes';
import { useAppSelector } from '@/store/hooks';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUpdateCommentMutation, useDeleteCommentMutation, useToggleCommentLikeMutation } from '@/services/blog/blogApi';
import { toast } from 'react-hot-toast';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

interface CommentProps {
    comment: CommentType;
    onReply: (commentId: string) => void;
    postId: string;
}

export function Comment({ comment, onReply }: CommentProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [editedContent, setEditedContent] = React.useState(comment.content);
    const { user } = useAppSelector((state) => state.auth);

    const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
    const [toggleLike] = useToggleCommentLikeMutation();

    const isAuthor = user?.id === comment.authorId;

    const handleEdit = async () => {
        if (!editedContent.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        try {
            await updateComment({
                commentId: comment.id,
                content: editedContent,
            }).unwrap();
            setIsEditing(false);
            toast.success('Comment updated');
        } catch (error) {
            toast.error('Failed to update comment');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteComment(comment.id).unwrap();
            toast.success('Comment deleted');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const handleLike = async () => {
        if (!user) {
            toast.error('You must be logged in to like comments');
            return;
        }

        try {
            await toggleLike(comment.id).unwrap();
        } catch (error) {
            toast.error('Failed to like comment');
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="space-y-2 text-light-text dark:text-dark-text">
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium text-light-text-secondary dark:text-dark-text-secondary">{comment.authorName}</div>
                    <div className="text-xs text-light-text-muted dark:text-dark-text-muted">
                        {formatDate(comment.createdDate)}
                        {comment.createdDate !== comment.lastModifiedDate && ' (edited)'}
                    </div>
                </div>
            </div>

            <div className="ml-10">
                {isEditing ? (
                    <div className="space-y-2">
                        <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={3}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleEdit} disabled={isUpdating}>
                                {isUpdating && <i className="ri-loader-4-line mr-1 animate-spin"></i>}
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditedContent(comment.content);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="rounded-md bg-light-bg-tertiary/40 dark:bg-dark-bg-tertiary/40 p-3">{comment.content}</div>

                        <div className="flex flex-wrap gap-2 text-sm">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto px-2 py-1"
                                onClick={handleLike}
                            >
                                <i className={`ri-heart-${comment.isLikedByUser ? 'fill' : 'line'} mr-1`}></i>
                                {comment.numberOfLikes} {comment.numberOfLikes === 1 ? 'Like' : 'Likes'}
                            </Button>

                            {user && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto px-2 py-1"
                                    onClick={() => onReply(comment.id)}
                                >
                                    <i className="ri-reply-line mr-1"></i> Reply
                                </Button>
                            )}

                            {isAuthor && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto px-2 py-1"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <i className="ri-edit-line mr-1"></i> Edit
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto px-2 py-1 text-error-600 dark:text-error-400"
                                        onClick={() => setShowDeleteConfirm(true)}
                                    >
                                        <i className="ri-delete-bin-line mr-1"></i> Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                title="Delete Comment"
                description="Are you sure you want to delete this comment? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}
