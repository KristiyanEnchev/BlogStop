import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../auth/baseQueryConfig';
import { BlogPost, BlogQueryParams, PaginatedResult } from '@/types/blog';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery,
  tagTypes: ['Blog', 'Comment'],
  endpoints: (builder) => ({
    // Endpoints will be added in subsequent commits
  }),
});
