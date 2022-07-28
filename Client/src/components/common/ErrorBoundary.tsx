import React from "react";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorPage error={this.state.error} />;
        }
        return this.props.children;
    }
}

function ErrorPage({ error }: { error?: Error }) {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text dark:text-dark-text">
            <div className="max-w-md w-full text-center bg-light-bg dark:bg-dark-bg p-6 rounded-lg shadow-card border border-light-bg-tertiary dark:border-dark-bg-tertiary">
                <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className="w-7 h-7 text-error-500 dark:text-error-400" />
                    <h1 className="text-2xl font-semibold text-light-text-secondary dark:text-dark-text-secondary">
                        Something went wrong
                    </h1>
                </div>
                <p className="mt-3 text-sm text-light-text-muted dark:text-dark-text-muted">
                    {error?.message || "An unexpected error occurred. Please try again later."}
                </p>
                <div className="mt-5 flex justify-center gap-3">
                    <Link
                        to="/"
                        className="px-4 py-2 rounded-md text-white bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-400 transition-colors duration-300"
                    >
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 rounded-md border border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}
