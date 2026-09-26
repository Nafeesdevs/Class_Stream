import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

// Layout components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Route protection
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

// Public Pages
import HomePage from "./pages/public/HomePage";
import CourseCatalogPage from "./pages/public/CourseCatalogPage";
import CourseDetailPage from "./pages/public/CourseDetailPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Learning Video Stream Page
import VideoLearningPage from "./pages/learn/VideoLearningPage";

// User Dashboard Pages
import UserDashboardLayout from "./pages/dashboard/UserDashboardLayout";
import DashboardOverviewPage from "./pages/dashboard/DashboardOverviewPage";
import MyLearningPage from "./pages/dashboard/MyLearningPage";
import PaymentHistoryPage from "./pages/dashboard/PaymentHistoryPage";
import ProfilePage from "./pages/dashboard/ProfilePage";

// Admin Dashboard Pages
import AdminDashboardLayout from "./pages/admin/AdminDashboardLayout";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminClassesPage from "./pages/admin/AdminClassesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminPaymentsPage from "./pages/admin/AdminPaymentsPage";
import AdminEnrollmentsPage from "./pages/admin/AdminEnrollmentsPage";

// Public site shell with Navbar and Footer
const PublicLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Layout Routes with standard Header and Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CourseCatalogPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Student Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverviewPage />} />
                <Route path="my-learning" element={<MyLearningPage />} />
                <Route path="payments" element={<PaymentHistoryPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Protected Admin Console */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminOverviewPage />} />
                <Route path="courses" element={<AdminCoursesPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="classes" element={<AdminClassesPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="payments" element={<AdminPaymentsPage />} />
                <Route path="enrollments" element={<AdminEnrollmentsPage />} />
              </Route>
            </Route>

            {/* Immersive Video Learning Player (Standalone Dark Theme Experience) */}
            <Route path="/learn/:id" element={<VideoLearningPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
