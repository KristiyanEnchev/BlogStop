export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  slug: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  authorImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  isPublished: boolean;
  viewCount: number;
  likeCount: number;
  readTime: number;
  categories: Category[];
  tags: Tag[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  content: string;
  blogPostId: string;
  authorId: string;
  authorName: string;
  authorImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  parentCommentId?: string;
  replies?: Comment[];
  isEdited: boolean;
}

export interface BlogPostRequest {
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  categoryIds: string[];
  tagIds: string[];
  isPublished: boolean;
}

export interface CommentRequest {
  content: string;
  blogPostId: string;
  parentCommentId?: string;
}

export interface LikeRequest {
  blogPostId: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface BlogQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
  isPublished?: boolean;
}
