import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../auth/baseQueryWithReauth';
import { BlogPost, BlogPostRequest, BlogQueryParams, Category, PaginatedResult, Tag } from '@/types/blog';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Blog', 'Comment', 'Category', 'Tag'],
  endpoints: (builder) => ({
    getBlogPosts: builder.query<PaginatedResult<BlogPost>, BlogQueryParams>({
      query: (params) => ({
        url: 'blog',
        params,
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Blog' as const, id })),
              { type: 'Blog', id: 'LIST' },
            ]
          : [{ type: 'Blog', id: 'LIST' }],
    }),
    getBlogPostById: builder.query<BlogPost, string>({
      query: (id) => `blog/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),
    createBlogPost: builder.mutation<BlogPost, BlogPostRequest>({
      query: (blogPost) => ({
        url: 'blog',
        method: 'POST',
        body: blogPost,
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),
    updateBlogPost: builder.mutation<BlogPost, { id: string; blogPost: BlogPostRequest }>({
      query: ({ id, blogPost }) => ({
        url: `blog/${id}`,
        method: 'PUT',
        body: blogPost,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),
    deleteBlogPost: builder.mutation<void, string>({
      query: (id) => ({
        url: `blog/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blog', id },
        { type: 'Blog', id: 'LIST' },
      ],
    }),
    likeBlogPost: builder.mutation<void, { id: string; like: boolean }>({
      query: ({ id, like }) => ({
        url: `blog/${id}/like`,
        method: 'POST',
        body: { like },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blog', id }],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => 'categories',
      providesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    getTags: builder.query<Tag[], void>({
      query: () => 'tags',
      providesTags: [{ type: 'Tag', id: 'LIST' }],
    }),
  }),
});

export const { 
  useGetBlogPostsQuery,
  useGetBlogPostByIdQuery,
  useCreateBlogPostMutation,
  useDeleteBlogPostMutation,
  useLikeBlogPostMutation,
  useUpdateBlogPostMutation,
  useGetCategoriesQuery,
  useGetTagsQuery
} = blogApi;
