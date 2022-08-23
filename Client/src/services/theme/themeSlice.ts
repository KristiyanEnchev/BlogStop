import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { initializeTheme } from "@/lib/theme";

interface ThemeState {
    isDark: boolean;
    theme: 'dark' | 'light';
}

const getInitialState = (): ThemeState => {
    const isDark = typeof window === "undefined" ? true : Boolean(initializeTheme());
    return {
        isDark,
        theme: isDark ? 'dark' : 'light'
    };
};

const themeSlice = createSlice({
    name: "theme",
    initialState: getInitialState(),
    reducers: {
        setTheme: (state, action: PayloadAction<boolean>) => {
            state.isDark = action.payload;
            state.theme = action.payload ? 'dark' : 'light';
            if (typeof window !== "undefined") {
                localStorage.setItem("theme", action.payload ? "dark" : "light");
                document.documentElement.classList.toggle("dark", action.payload);
            }
        },
        toggleTheme: (state) => {
            themeSlice.caseReducers.setTheme(state, { payload: !state.isDark } as PayloadAction<boolean>);
        },
    },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const selectIsDark = (state: RootState) => state.theme.isDark;
export const selectTheme = (state: RootState) => state.theme.theme;
export default themeSlice.reducer;
