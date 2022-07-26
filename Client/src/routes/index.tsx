import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
            </Route>
        </Routes>
    );
}
