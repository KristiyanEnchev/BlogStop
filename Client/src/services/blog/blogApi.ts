import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../auth/baseQueryWithReauth';
import {
  BlogPost,
  Category,
  Tag,
  Comment,
  BlogPostRequest,
  CommentRequest,
  PaginatedResult,
  BlogQueryParams
} from '@/types/blog';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['BlogPosts', 'Categories', 'Tags', 'Comments'],
  endpoints: (builder) => ({
    getBlogPosts: builder.query<PaginatedResult<BlogPost>, BlogQueryParams>({
      query: (params) => ({
        url: 'blog',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: 'BlogPosts' as const, id })),
            { type: 'BlogPosts', id: 'LIST' },
          ]
          : [{ type: 'BlogPosts', id: 'LIST' }],
    }),

    getBlogPostById: builder.query<BlogPost, string>({
      query: (id) => `blog/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'BlogPosts', id }],
    }),

    createBlogPost: builder.mutation<BlogPost, BlogPostRequest>({
      query: (blogPost) => ({
        url: 'blog',
        method: 'POST',
        body: blogPost,
      }),
      invalidatesTags: [{ type: 'BlogPosts', id: 'LIST' }],
    }),

    updateBlogPost: builder.mutation<boolean, { id: string; blogPost: BlogPostRequest }>({
      query: ({ id, blogPost }) => ({
        url: `blog/${id}`,
        method: 'PUT',
        body: blogPost,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'BlogPosts', id },
        { type: 'BlogPosts', id: 'LIST' },
      ],
    }),

    deleteBlogPost: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `blog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'BlogPosts', id: 'LIST' }],
    }),

    toggleLikeBlogPost: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `blog/${id}/toggle-like`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'BlogPosts', id }],
    }),

    getCategories: builder.query<Category[], void>({
      query: () => 'blog/categories',
      providesTags: [{ type: 'Categories', id: 'LIST' }],
    }),

    getTags: builder.query<Tag[], void>({
      query: () => 'blog/tags',
      providesTags: [{ type: 'Tags', id: 'LIST' }],
    }),

    getComments: builder.query<PaginatedResult<Comment>, { postId: string; page?: number; pageSize?: number }>({
      query: ({ postId, page = 1, pageSize = 10 }) => ({
        url: `blog/${postId}/comments`,
        params: { page, pageSize },
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.items.map(({ id }) => ({ type: 'Comments' as const, id })),
            { type: 'Comments', id: 'LIST' },
          ]
          : [{ type: 'Comments', id: 'LIST' }],
    }),

    createComment: builder.mutation<Comment, { postId: string; comment: CommentRequest }>({
      query: ({ postId, comment }) => ({
        url: `blog/${postId}/comments`,
        method: 'POST',
        body: comment,
      }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
    }),

    updateComment: builder.mutation<boolean, { commentId: string; content: string }>({
      query: ({ commentId, content }) => ({
        url: `blog/comments/${commentId}`,
        method: 'PUT',
        body: { newContent: content },
      }),
      invalidatesTags: (_result, _error, { commentId }) => [{ type: 'Comments', id: commentId }],
    }),

    deleteComment: builder.mutation<boolean, string>({
      query: (commentId) => ({
        url: `blog/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
    }),

    toggleCommentLike: builder.mutation<boolean, string>({
      query: (commentId) => ({
        url: `blog/comments/${commentId}/toggle-like`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, commentId) => [{ type: 'Comments', id: commentId }],
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostByIdQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
  useToggleLikeBlogPostMutation,
  useGetCategoriesQuery,
  useGetTagsQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useToggleCommentLikeMutation,
} = blogApi;
