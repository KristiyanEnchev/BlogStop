import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { lazy } from "react";
import GuestRoute from "./GuestRoute";
import PageWrapper from "@/components/common/PageWrapper";
import ProtectedRoute from "./ProtectedRoute";

const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const BlogHome = lazy(() => import("@/pages/BlogHomePage"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const CreateEditBlog = lazy(() => import("@/pages/CreateEditBlogPage"));

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route element={<GuestRoute />}>
                    <Route path="login" element={<PageWrapper component={Login} />} />
                    <Route path="register" element={<PageWrapper component={Register} />} />
                </Route>

                <Route path="/">
                    <Route index element={<PageWrapper component={BlogHome} />} />
                    <Route path=":id" element={<PageWrapper component={BlogDetail} />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="create" element={<PageWrapper component={CreateEditBlog} />} />
                        <Route path="edit/:id" element={<PageWrapper component={CreateEditBlog} />} />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<PageWrapper component={NotFound} />} />
        </Routes>
    );
}
