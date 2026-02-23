import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Auth";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import MessagesPage from "./pages/Messages";
import SearchPage from "./pages/Search";
import FriendsPage from "./pages/Friends";
import NotificationsPage from "./pages/Notifications";
import BasePage from "./pages/Base";
import { AdminLayout, AdminDashboard, AdminPosts, AdminComments, AdminReports, AdminRoles, AdminUsers } from "./pages/Admin";
import { CurrentUserProvider } from "./context/currentUserContext";
import "./App.css";

function App() {
  return (
    <CurrentUserProvider>
      <Router>
        <Routes>
          {/* Public routes - không có Navbar */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes - có Navbar thông qua BasePage layout */}
          <Route element={<BasePage />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            {/* Thêm route mới ở đây, tự động có Navbar */}
          </Route>

          {/* Admin routes - có AdminLayout riêng */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/comments" element={<AdminComments />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/roles" element={<AdminRoles />} />
          </Route>
        </Routes>
      </Router>
    </CurrentUserProvider>
  );
}

export default App;


