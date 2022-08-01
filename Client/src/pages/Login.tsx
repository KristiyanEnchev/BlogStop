import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Loader2, User } from "lucide-react";
import { useLoginMutation } from "@/services/auth/authApi";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/services/auth/authSlice";

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [login] = useLoginMutation();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true);
            const result = await login(data).unwrap();
            dispatch(setCredentials(result));
            navigate(location.state?.from?.pathname || "/", { replace: true });
            toast.success("Successfully logged in!");
        } catch {
            toast.error("Failed to login. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-light-bg-secondary dark:bg-dark-bg-secondary">
            <div className="max-w-md w-full bg-light-bg dark:bg-dark-bg p-8 rounded-lg shadow-card border border-light-bg-tertiary dark:border-dark-bg-tertiary">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-light-text-secondary dark:text-dark-text-secondary">
                        Sign in
                    </h2>
                </div>
                <p className="text-center text-sm text-light-text-muted dark:text-dark-text-muted mb-6">
                    Use <span className="font-medium text-primary-600 dark:text-primary-400">admin@admin.com / 123456</span> to sign in
                </p>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="Email"
                            className="w-full px-4 py-2
                            bg-light-bg dark:bg-dark-bg
                            border border-light-bg-tertiary dark:border-dark-bg-tertiary
                            rounded-lg
                            text-light-text dark:text-dark-text
                            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                            transition-all duration-300"
                            disabled={isLoading}
                        />
                        {errors.email && <p className="text-xs text-error-500 mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            {...register("password")}
                            placeholder="Password"
                            className="w-full px-4 py-2
                            bg-light-bg dark:bg-dark-bg
                            border border-light-bg-tertiary dark:border-dark-bg-tertiary
                            rounded-lg
                            text-light-text dark:text-dark-text
                            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                            transition-all duration-300"
                            disabled={isLoading}
                        />
                        {errors.password && <p className="text-xs text-error-500 mt-1">{errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center items-center gap-2 px-4 py-3
                        rounded-lg
                        bg-primary-600 dark:bg-primary-500
                        text-white
                        hover:bg-primary-700 dark:hover:bg-primary-400
                        transition-colors duration-300
                        disabled:opacity-50
                        focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-300"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign in"}
                    </button>
                </form>
                <p className="text-center text-sm text-light-text-muted dark:text-dark-text-muted mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-primary-600 dark:text-primary-400
                        hover:text-primary-700 dark:hover:text-primary-300
                        transition-colors duration-300"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
