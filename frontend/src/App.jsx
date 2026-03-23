import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage, ProtectedRoute, PermissionRoute, GuestRoute, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from "./pages/Auth";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import MessagesPage from "./pages/Messages";
import SearchPage from "./pages/Search";
import FriendsPage from "./pages/Friends";
import NotificationsPage from "./pages/Notifications";
import BasePage from "./pages/Base";
import PostDetailPage from "./pages/Post";
import SettingsPage from "./pages/Settings";
import { AboutPage, TermsPage, PrivacyPage } from "./pages/Info";
import { AdminLayout, AdminDashboard, AdminPosts, AdminComments, AdminReports, AdminRoles, AdminUsers } from "./pages/Admin";
import { CurrentUserProvider, useCurrentUser } from "./context/currentUserContext";
import "./App.css";


const RouteApp=()=>{
  const context = useCurrentUser();
  return (
      <Router>
        <Routes>
          {/* Guest-only routes: nếu đã đăng nhập → về trang chủ */}
          <Route element={<GuestRoute user={context?.currentUser} isLoading={context?.isLoading} />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Public routes không cần auth */}
          <Route path="/posts/:id" element={<PostDetailPage />} />

          {/* Protected routes - có Navbar thông qua BasePage layout */}
          <Route element={<BasePage />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Route>

          {/* Admin routes - có AdminLayout riêng */}
          <Route element={<ProtectedRoute user={context?.currentUser} isLoading={context?.isLoading} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route element={<PermissionRoute user={context?.currentUser} permission="dashboard" />}>
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>

              <Route element={<PermissionRoute user={context?.currentUser} permission="user" />}>
                <Route path="users" element={<AdminUsers />} />
              </Route>

              <Route element={<PermissionRoute user={context?.currentUser} permission="post" />}>
                <Route path="posts" element={<AdminPosts />} />
              </Route>

              <Route element={<PermissionRoute user={context?.currentUser} permission="comment" />}>
                <Route path="comments" element={<AdminComments />} />
              </Route>

              <Route element={<PermissionRoute user={context?.currentUser} permission="report" />}>
                <Route path="reports" element={<AdminReports />} />
              </Route>

              <Route element={<PermissionRoute user={context?.currentUser} permission="role" />}>
                <Route path="roles" element={<AdminRoles />} />
              </Route>
            </Route>
          </Route>

          {/* 404 - Not Found */}
          <Route path="/404" element={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
              <h1 style={{ fontSize: 72, fontWeight: 700, color: '#6366f1', margin: 0 }}>404</h1>
              <h2 style={{ fontSize: 24, color: '#475569', margin: 0 }}>Trang không tồn tại</h2>
              <p style={{ color: '#94a3b8' }}>Trang này không tồn tại.</p>
              <a href="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>← Về trang chủ</a>
            </div>
          } />
          <Route path="*" element={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
              <h1 style={{ fontSize: 72, fontWeight: 700, color: '#6366f1', margin: 0 }}>404</h1>
              <h2 style={{ fontSize: 24, color: '#475569', margin: 0 }}>Trang không tồn tại</h2>
              <p style={{ color: '#94a3b8' }}>Trang này không tồn tại.</p>
              <a href="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>← Về trang chủ</a>
            </div>
          } />
        </Routes>
      </Router>
  );
}
function App() {
  return (
    <CurrentUserProvider>
      <RouteApp/>
    </CurrentUserProvider>
  );
}

export default App;
