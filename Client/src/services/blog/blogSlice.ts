// src/services/blog/blogSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlogPost, Category, Tag } from '@/types/blog';

interface BlogState {
    currentPost: BlogPost | null;
    featuredPosts: BlogPost[];
    recentPosts: BlogPost[];
    popularCategories: Category[];
    popularTags: Tag[];
    searchTerm: string;
    currentCategory: string | null;
    currentTag: string | null;
}

const initialState: BlogState = {
    currentPost: null,
    featuredPosts: [],
    recentPosts: [],
    popularCategories: [],
    popularTags: [],
    searchTerm: '',
    currentCategory: null,
    currentTag: null,
};

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setCurrentPost: (state, action: PayloadAction<BlogPost | null>) => {
            state.currentPost = action.payload;
        },
        setFeaturedPosts: (state, action: PayloadAction<BlogPost[]>) => {
            state.featuredPosts = action.payload;
        },
        setRecentPosts: (state, action: PayloadAction<BlogPost[]>) => {
            state.recentPosts = action.payload;
        },

    },
});

export const {
    setCurrentPost,
    setFeaturedPosts,
    setRecentPosts,

} = blogSlice.actions;

export default blogSlice.reducer;
