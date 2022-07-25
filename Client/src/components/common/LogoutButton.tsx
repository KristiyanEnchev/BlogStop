import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/services/auth/authSlice";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface LogoutButtonProps {
    showText?: boolean;
    className?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
    showText = true,
    className = "flex items-center gap-2 px-4 py-2 rounded-lg border border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-colors duration-300",
}) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser());
            toast.success("Successfully logged out!", {
                style: {
                    background: '#4a90e2',
                    color: '#ffffff',
                },
                iconTheme: {
                    primary: '#ffffff',
                    secondary: '#4a90e2',
                },
            });
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error(`Logout failed: ${error}`, {
                style: {
                    background: '#ff4d4f',
                    color: '#ffffff',
                },
            });
        }
    };

    return (
        <motion.button
            onClick={handleLogout}
            className={className}
            title="Logout"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <LogOut className="w-4 h-4" />
            {showText && <span>Logout</span>}
        </motion.button>
    );
};
