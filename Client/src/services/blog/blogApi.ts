import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../auth/baseQueryWithReauth';
import { BlogPost, BlogQueryParams, PaginatedResult } from '@/types/blog';

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
  }),
});
