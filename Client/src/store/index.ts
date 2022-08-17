import { configureStore, isRejectedWithValue, Middleware, combineReducers } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import toast from 'react-hot-toast';
import persistReducer from 'redux-persist/es/persistReducer';

import themeReducer from '@/services/theme/themeSlice';
import authReducer from '@/services/auth/authSlice';
import blogReducer from '@/services/blog/blogSlice';

import { authApi } from '@/services/auth/authApi';
import { blogApi } from '@/services/blog/blogApi';

const themePersistConfig = {
    key: 'theme',
    storage,
    whitelist: ['isDark']
};

const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'token', 'refreshToken', 'refreshTokenExpiryTime']
};

const blogPersistConfig = {
    key: 'blog',
    storage,
    whitelist: ['currentCategory', 'currentTag', 'searchTerm']
};

const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const payload = action.payload as { status?: number; data?: { message?: string } };
        if (payload.status !== 401) {
            console.error('API Error:', payload);
            toast.error(payload.data?.message || 'An error occurred');
        }
    }
    return next(action);
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    theme: persistReducer(themePersistConfig, themeReducer),
    blog: persistReducer(blogPersistConfig, blogReducer),
    [authApi.reducerPath]: authApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(
            authApi.middleware,
            blogApi.middleware,
            rtkQueryErrorLogger
        ),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
