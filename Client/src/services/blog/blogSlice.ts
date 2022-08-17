import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlogPost, Category, Tag } from '@/types/blogTypes';

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
        setPopularCategories: (state, action: PayloadAction<Category[]>) => {
            state.popularCategories = action.payload;
        },
        setPopularTags: (state, action: PayloadAction<Tag[]>) => {
            state.popularTags = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setCurrentCategory: (state, action: PayloadAction<string | null>) => {
            state.currentCategory = action.payload;
        },
        setCurrentTag: (state, action: PayloadAction<string | null>) => {
            state.currentTag = action.payload;
        },
        resetBlogState: (_state) => {
            return initialState;
        },
    },
});

export const {
    setCurrentPost,
    setFeaturedPosts,
    setRecentPosts,
    setPopularCategories,
    setPopularTags,
    setSearchTerm,
    setCurrentCategory,
    setCurrentTag,
    resetBlogState,
} = blogSlice.actions;

export default blogSlice.reducer;
