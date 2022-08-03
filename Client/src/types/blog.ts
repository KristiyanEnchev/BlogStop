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
