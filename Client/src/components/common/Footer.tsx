import { LineChart } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full py-6 bg-light-bg-secondary dark:bg-dark-bg-secondary">
            <div className="container mx-auto px-4 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-light-text-muted dark:text-dark-text-muted">
                    <span className="flex items-center gap-2">
                        {new Date().getFullYear()} BlogStop
                        <LineChart className="w-4 h-4 text-accent-500 dark:text-accent-400" />
                        by{" "}
                        <a
                            href="https://kristiyan-enchev-website.web.app/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary-600 dark:text-primary-300
                                       hover:text-primary-700 dark:hover:text-primary-200
                                       transition-colors duration-300 ease-smooth"
                        >
                            Kristiyan Enchev
                        </a>
                    </span>
                </div>
            </div>
        </footer>
    );
}
