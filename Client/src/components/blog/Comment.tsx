import React from 'react';
import { Comment as CommentType } from '@/types/blogTypes';
import { useAppSelector } from '@/store/hooks';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUpdateCommentMutation, useDeleteCommentMutation, useToggleCommentLikeMutation } from '@/services/blog/blogApi';
import { toast } from 'react-hot-toast';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Heart, Reply, Edit2, Trash, MoreHorizontal, CornerDownRight } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentProps {
    comment: CommentType;
    onReply: (commentId: string) => void;
    postId: string;
    replies?: CommentType[];
    level?: number;
}

export function Comment({ comment, onReply, postId, replies = [], level = 0 }: CommentProps) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [editedContent, setEditedContent] = React.useState(comment.content);
    const { user } = useAppSelector((state) => state.auth);

    const [updateComment, { isLoading: isUpdating }] = useUpdateCommentMutation();
    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
    const [toggleLike] = useToggleCommentLikeMutation();

    const isAuthor = user?.id === comment.authorId;
    const authorInitials = comment.authorName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const maxNestingLevel = 3;
    const currentLevel = Math.min(level, maxNestingLevel);
    const hasReplies = replies && replies.length > 0;

    const handleEdit = async () => {
        if (!editedContent.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        try {
            await updateComment({
                commentId: comment.id.toString(),
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
            await deleteComment(comment.id.toString()).unwrap();
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
            await toggleLike(comment.id.toString()).unwrap();
        } catch (error) {
            toast.error('Failed to like comment');
        }
    };

    const commentReplies = replies.filter(reply => reply.parentCommentId === comment.id);

    return (
        <>
            <div className={`group relative rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary p-3 shadow-sm hover:shadow-md transition-shadow ${level > 0 ? 'ml-5 border-l-2 border-primary-100 dark:border-primary-800 pl-4' : ''}`}>
                {level > 0 && (
                    <div className="absolute -left-2.5 top-4">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                            <CornerDownRight className="h-2.5 w-2.5" />
                        </div>
                    </div>
                )}
                
                <div className="flex gap-2">
                    <Avatar className="h-8 w-8 border-2 border-primary-100 dark:border-primary-900">
                        {comment.authorImage ? (
                            <AvatarImage src={comment.authorImage} alt={comment.authorName} />
                        ) : (
                            <AvatarFallback className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-xs">
                                {authorInitials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-light-text-secondary dark:text-dark-text-secondary text-sm">
                                    {comment.authorName}
                                </div>
                                <div className="text-xs text-light-text-muted dark:text-dark-text-muted">
                                    <span title={formatDate(comment.createdDate)}>
                                        {formatTimeAgo(comment.createdDate)}
                                    </span>
                                    {comment.createdDate !== comment.lastModifiedDate && 
                                        <span className="text-primary-500 dark:text-primary-400 ml-1">(edited)</span>
                                    }
                                </div>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="space-y-2 mt-2">
                                <Textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    rows={2}
                                    className="resize-none text-sm"
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditedContent(comment.content);
                                        }}
                                        className="h-7 text-xs border-light-bg-tertiary dark:border-dark-bg-tertiary text-light-text-muted dark:text-dark-text-muted hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        onClick={handleEdit} 
                                        disabled={isUpdating}
                                        className="h-7 text-xs bg-primary-600 hover:bg-primary-700 text-white"
                                    >
                                        {isUpdating ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="text-light-text dark:text-dark-text text-sm mt-1.5 mb-1.5">
                                    {comment.content}
                                </div>

                                <div className="flex items-center gap-1 justify-between">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`h-6 px-1.5 py-0 rounded-full text-xs font-medium ${
                                                comment.isLikedByUser 
                                                    ? "text-red-600 dark:text-red-400" 
                                                    : "text-light-text-muted dark:text-dark-text-muted"
                                            }`}
                                            onClick={handleLike}
                                        >
                                            <Heart className={`h-3 w-3 mr-1 ${
                                                comment.isLikedByUser ? "fill-red-600 dark:fill-red-400" : ""
                                            }`} />
                                            <span>{comment.numberOfLikes || ''}</span>
                                        </Button>

                                        {user && currentLevel < maxNestingLevel && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-1.5 py-0 rounded-full text-xs font-medium text-light-text-muted dark:text-dark-text-muted"
                                                onClick={() => onReply(comment.id)}
                                            >
                                                <Reply className="h-3 w-3 mr-1" />
                                                <span>Reply</span>
                                            </Button>
                                        )}
                                    </div>
                                    
                                    {isAuthor && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-light-text-muted dark:text-dark-text-muted hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                                                >
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                    <span className="sr-only">More</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-light-bg dark:bg-dark-bg border-light-bg-tertiary dark:border-dark-bg-tertiary min-w-[120px]">
                                                <DropdownMenuItem 
                                                    onClick={() => setIsEditing(true)}
                                                    className="text-light-text dark:text-dark-text hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer text-xs py-1.5"
                                                >
                                                    <Edit2 className="mr-2 h-3.5 w-3.5" />
                                                    <span>Edit</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 cursor-pointer text-xs py-1.5"
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                >
                                                    <Trash className="mr-2 h-3.5 w-3.5" />
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
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
            
            {hasReplies && (
                <div className={`space-y-2 mt-2 ${level > 0 ? 'ml-5' : ''}`}>
                    {commentReplies.map((reply) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            postId={postId}
                            replies={replies}
                            level={currentLevel + 1}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
