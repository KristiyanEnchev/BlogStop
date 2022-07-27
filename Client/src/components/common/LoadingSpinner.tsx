import { PenTool, Pen } from "lucide-react";

interface LoadingSpinnerProps {
    variant?: "default" | "alternative";
    size?: "small" | "medium" | "large";
    showText?: boolean;
    fullScreen?: boolean;
}

const sizeClasses = {
    small: {
        wrapper: "w-16 h-16",
        icon: "w-8 h-8",
        text: "text-xs",
    },
    medium: {
        wrapper: "w-24 h-24",
        icon: "w-12 h-12",
        text: "text-sm",
    },
    large: {
        wrapper: "w-32 h-32",
        icon: "w-16 h-16",
        text: "text-base",
    },
} as const;

export default function LoadingSpinner({
    variant = "default",
    size = "medium",
    showText = true,
    fullScreen = false,
}: LoadingSpinnerProps = {}): JSX.Element {
    const SpinnerContent = (
        <div className="flex flex-col items-center justify-center" data-testid="loading-spinner">
            {variant === "default" ? (
                <div className={`relative ${sizeClasses[size].wrapper}`}>
                    <div className="absolute inset-0 rounded-full border-4 border-primary-500/30 dark:border-primary-400/30" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary-500 dark:border-primary-400 border-t-transparent animate-spin" />
                    <div
                        className="absolute inset-0 flex items-center justify-center animate-spin"
                        style={{ animationDirection: "reverse", animationDuration: "3s" }}
                    >
                        <PenTool className={`${sizeClasses[size].icon} text-primary-600 dark:text-primary-300`} />
                    </div>
                </div>
            ) : (
                <div className={`relative ${sizeClasses[size].wrapper}`}>
                    <div className="absolute inset-0 rounded-lg border-2 border-primary-500/30 dark:border-primary-400/30 animate-spin-slow" />
                    <div
                        className="absolute inset-2 rounded-full border-2 border-primary-500 dark:border-primary-400 animate-spin-fast"
                        style={{ animationDuration: "2s" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                        <Pen className={`${sizeClasses[size].icon} text-primary-600 dark:text-primary-300`} />
                    </div>
                </div>
            )}
            {showText && (
                <div className="mt-4 space-y-1 text-center">
                    <p className={`${sizeClasses[size].text} text-light-text-secondary dark:text-dark-text-secondary`}>
                        Loading content...
                    </p>
                </div>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 min-h-screen flex items-center justify-center bg-light-bg-secondary/80 dark:bg-dark-bg-secondary/80 backdrop-blur-sm">
                {SpinnerContent}
            </div>
        );
    }

    return SpinnerContent;
}
