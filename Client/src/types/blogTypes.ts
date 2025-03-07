export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  isFeatured: boolean;
  isPublished: boolean;
  authorId: string;
  authorName: string;
  authorImage: string;
  viewCount: number;
  numberOfLikes: number;
  isLikedByUser: boolean;
  categories: string[];
  tags: string[];
  createdDate: string;
  lastModifiedDate: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  postId: string;
  parentCommentId?: string;
  createdDate: string;
  lastModifiedDate: string;
  numberOfLikes: number;
  isLikedByUser: boolean;
}

export interface BlogPostRequest {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string | undefined;
  isFeatured: boolean;
  isPublished: boolean;
  authorId: string;
  authorName: string;
  categoryNames: string[];
  tags: string[];
}

export interface CommentRequest {
  content: string;
  userId: string;
  parentCommentId?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BlogQueryParams {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
