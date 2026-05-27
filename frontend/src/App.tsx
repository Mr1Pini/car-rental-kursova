import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import CarDetailPage from "./pages/CarDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCarsPage from "./pages/admin/AdminCarsPage";
import AdminRentalsPage from "./pages/admin/AdminRentalsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminReviewsPage from "./pages/admin/AdminReviewsPage";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="car/:id" element={<CarDetailPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            <Route element={<ProtectedRoute requireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route path="admin" element={<AdminDashboardPage />} />
                <Route path="admin/cars" element={<AdminCarsPage />} />
                <Route path="admin/rentals" element={<AdminRentalsPage />} />
                <Route path="admin/users" element={<AdminUsersPage />} />
                <Route path="admin/reviews" element={<AdminReviewsPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
