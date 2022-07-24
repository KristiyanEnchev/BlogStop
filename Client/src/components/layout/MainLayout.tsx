import { Outlet } from 'react-router-dom';
import { Footer } from '@/components/common/Footer';

export function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
            <main className="flex-grow pt-16">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
