import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme, selectIsDark } from "@/services/theme/themeSlice";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const dispatch = useAppDispatch();
    const isDark = useAppSelector(selectIsDark);

    return (
        <motion.button
            onClick={() => dispatch(toggleTheme())}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className="p-2 rounded-full
                       bg-light-bg-tertiary dark:bg-dark-bg-tertiary
                       border border-light-bg
                       dark:border-dark-bg-secondary
                       text-light-text-secondary dark:text-dark-text-secondary
                       hover:bg-primary-100 dark:hover:bg-primary-800
                       focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-300
                       transition-all duration-300 ease-smooth
                       shadow-sm hover:shadow-md"
            aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: isDark ? 180 : 0,
                    scale: isDark ? 0.8 : 1
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }}
            >
                {isDark ? (
                    <Moon className="w-5 h-5 text-primary-400 dark:text-primary-300" />
                ) : (
                    <Sun className="w-5 h-5 text-primary-600 dark:text-primary-500" />
                )}
            </motion.div>
        </motion.button>
    );
}
