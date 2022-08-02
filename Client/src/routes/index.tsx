import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { lazy } from "react";
import GuestRoute from "./GuestRoute";
import PageWrapper from "@/components/common/PageWrapper";
import ProtectedRoute from "./ProtectedRoute";

const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route element={<GuestRoute />}>
                    <Route path="login" element={<PageWrapper component={Login} />} />
                    <Route path="register" element={<PageWrapper component={Register} />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                </Route>
            </Route>
            <Route path="*" element={<PageWrapper component={NotFound} />} />
        </Routes>
    );
}
