import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Loader2, User } from "lucide-react";
import { useRegisterMutation } from "@/services/auth/authApi";

const registerSchema = z
    .object({
        firstName: z.string().min(2, "First Name must be at least 2 characters"),
        lastName: z.string().min(2, "Last Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
    const navigate = useNavigate();
    const [register] = useRegisterMutation();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true);
            await register({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
            }).unwrap();

            navigate("/", { replace: true });
            toast.success("Registration successful!");
        } catch {
            toast.error("Failed to register. Please try again.");
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
                        Create an Account
                    </h2>
                </div>
                <p className="text-center text-sm text-light-text-muted dark:text-dark-text-muted mb-6">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-primary-600 dark:text-primary-400
                        hover:text-primary-700 dark:hover:text-primary-300
                        transition-colors duration-300"
                    >
                        Sign in here
                    </Link>
                </p>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                {...registerField("firstName")}
                                placeholder="First Name"
                                className="w-full px-4 py-2
                                bg-light-bg dark:bg-dark-bg
                                border border-light-bg-tertiary dark:border-dark-bg-tertiary
                                rounded-lg
                                text-light-text dark:text-dark-text
                                focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                                transition-all duration-300"
                                disabled={isLoading}
                            />
                            {errors.firstName && <p className="text-xs text-error-500 mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                {...registerField("lastName")}
                                placeholder="Last Name"
                                className="w-full px-4 py-2
                                bg-light-bg dark:bg-dark-bg
                                border border-light-bg-tertiary dark:border-dark-bg-tertiary
                                rounded-lg
                                text-light-text dark:text-dark-text
                                focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                                transition-all duration-300"
                                disabled={isLoading}
                            />
                            {errors.lastName && <p className="text-xs text-error-500 mt-1">{errors.lastName.message}</p>}
                        </div>
                    </div>
                    <div>
                        <input
                            type="email"
                            {...registerField("email")}
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
                            {...registerField("password")}
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
                    <div>
                        <input
                            type="password"
                            {...registerField("confirmPassword")}
                            placeholder="Confirm Password"
                            className="w-full px-4 py-2
                            bg-light-bg dark:bg-dark-bg
                            border border-light-bg-tertiary dark:border-dark-bg-tertiary
                            rounded-lg
                            text-light-text dark:text-dark-text
                            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                            transition-all duration-300"
                            disabled={isLoading}
                        />
                        {errors.confirmPassword && <p className="text-xs text-error-500 mt-1">{errors.confirmPassword.message}</p>}
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
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
