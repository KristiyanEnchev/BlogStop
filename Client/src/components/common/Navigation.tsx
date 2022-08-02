import { Link } from "react-router-dom";
import { ChevronDown, Pen, User } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { LogoutButton } from "./LogoutButton";
import { useEffect, useRef, useState } from "react";
import { selectCurrentUser } from "@/services/auth/authSlice";
import { useAppSelector } from "@/store/hooks";

export function Navigation() {
    const user = useAppSelector(selectCurrentUser);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text dark:text-dark-text border-b border-light-bg-tertiary dark:border-dark-bg-tertiary">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between h-16 px-6 items-center">
                    <Link
                        to="/"
                        className="flex items-center gap-3 text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 transition-colors duration-300"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                            <Pen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-xl font-bold">BlogStop</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300"
                                >
                                    <User className="w-5 h-5" />
                                    <span>{user.firstName}</span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-card bg-light-bg dark:bg-dark-bg border border-light-bg-tertiary dark:border-dark-bg-tertiary">
                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-2 px-4 py-2 text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors duration-300"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                <span>Profile</span>
                                            </Link>
                                            <div className="flex items-center justify-between px-4 py-2">
                                                <LogoutButton />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-lg bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-400 transition-colors duration-300"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 rounded-lg border border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-colors duration-300"
                                >
                                    Register
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </nav>
    );
}
