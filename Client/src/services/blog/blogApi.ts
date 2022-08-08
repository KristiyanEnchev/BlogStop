import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../auth/baseQueryWithReauth';
import { BlogPost, BlogPostRequest, BlogQueryParams, PaginatedResult } from '@/types/blog';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Blog', 'Comment'],
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
  }),
});

export const { 
  useGetBlogPostsQuery,
  useGetBlogPostByIdQuery,
  useCreateBlogPostMutation
} = blogApi;
