import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text dark:text-dark-text relative">
            <div className="absolute inset-0 border border-light-bg-tertiary dark:border-dark-bg-tertiary opacity-10" />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }}
                className="max-w-md w-full space-y-6 bg-light-bg dark:bg-dark-bg p-8 rounded-lg shadow-card relative text-center border border-light-bg-tertiary dark:border-dark-bg-tertiary"
            >
                <div className="mx-auto w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h1 className="mt-4 text-3xl font-bold text-light-text-secondary dark:text-dark-text-secondary">
                    Page Not Found
                </h1>
                <p className="text-sm text-light-text-muted dark:text-dark-text-muted">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <motion.button
                    onClick={() => navigate("/")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex justify-center items-center gap-2 px-4 py-3
                               border border-transparent rounded-lg
                               bg-primary-600 dark:bg-primary-500
                               text-white
                               hover:bg-primary-700 dark:hover:bg-primary-400
                               transition-colors duration-300
                               focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-300"
                >
                    Go Home
                </motion.button>
            </motion.div>
        </div>
    );
}
