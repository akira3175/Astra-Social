// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { LoginPage, ProtectedRoute, PermissionRoute, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from "./pages/Auth";
// import HomePage from "./pages/Home";
// import ProfilePage from "./pages/Profile";
// import MessagesPage from "./pages/Messages";
// import SearchPage from "./pages/Search";
// import FriendsPage from "./pages/Friends";
// import NotificationsPage from "./pages/Notifications";
// import BasePage from "./pages/Base";
// import SearchPage from "./pages/Search/SearchPage";
// import { CurrentUserProvider } from "./context/currentUserContext";
// import PostDetailPage from "./pages/Post";
// import SettingsPage from "./pages/Settings";
// import { AboutPage, TermsPage, PrivacyPage } from "./pages/Info";
// import { AdminLayout, AdminDashboard, AdminPosts, AdminComments, AdminReports, AdminRoles, AdminUsers } from "./pages/Admin";
// import { CurrentUserProvider, useCurrentUser } from "./context/currentUserContext";
// import "./App.css";


// const RouteApp=()=>{
//   const context = useCurrentUser();
//   return (
//       <Router>
//         <Routes>
//           {/* Public routes - không có Navbar */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/posts/:id" element={<PostDetailPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//           <Route path="/reset-password" element={<ResetPasswordPage />} />

//           {/* Protected routes - có Navbar thông qua BasePage layout */}
//           <Route element={<BasePage />}>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/profile/:userId" element={<ProfilePage />} />
//             <Route path="/messages" element={<MessagesPage />} />
//             <Route path="/search" element={<SearchPage />} />
//             <Route path="/friends" element={<FriendsPage />} />
//             <Route path="/notifications" element={<NotificationsPage />} />
//             <Route path="/settings" element={<SettingsPage />} />
//             <Route path="/about" element={<AboutPage />} />
//             <Route path="/terms" element={<TermsPage />} />
//             <Route path="/privacy" element={<PrivacyPage />} />
//             {/* Thêm route mới ở đây, tự động có Navbar */}
//           </Route>

//           {/* Admin routes - có AdminLayout riêng */}

//           <Route element={<ProtectedRoute user={context.currentUser}
//                                           isLoading={context.isLoading}
//           />}>

//             <Route path="/admin" element={<AdminLayout />}>

//             <Route element={<PermissionRoute user={context.currentUser} permission="dashboard" />}>
//               <Route path="dashboard" element={<AdminDashboard />} />
//             </Route>

//             <Route element={<PermissionRoute user={context.currentUser} permission="user" />}>
//               <Route path="users" element={<AdminUsers />} />
//             </Route>

//             <Route element={<PermissionRoute user={context.currentUser} permission="posts" />}>
//               <Route path="posts" element={<AdminPosts />} />
//             </Route>

//             <Route element={<PermissionRoute user={context.currentUser} permission="comments" />}>
//               <Route path="comments" element={<AdminComments />} />
//             </Route>

//             <Route element={<PermissionRoute user={context.currentUser} permission="reports" />}>
//               <Route path="reports" element={<AdminReports />} />
//             </Route>

//             <Route element={<PermissionRoute user={context.currentUser} permission="roles" />}>
//               <Route path="roles" element={<AdminRoles />} />
//             </Route>

//             </Route>
//           </Route>
//         </Routes>
//       </Router>
//   );
// }
// function App() {
//   return (
//     <CurrentUserProvider>
//       <RouteApp/>
//     </CurrentUserProvider>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage, ProtectedRoute, PermissionRoute, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from "./pages/Auth";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import MessagesPage from "./pages/Messages";
import SearchPage from "./pages/Search"; // Giữ lại import này
import FriendsPage from "./pages/Friends";
import NotificationsPage from "./pages/Notifications";
import BasePage from "./pages/Base";
import PostDetailPage from "./pages/Post";
import SettingsPage from "./pages/Settings";
import { AboutPage, TermsPage, PrivacyPage } from "./pages/Info";
import { AdminLayout, AdminDashboard, AdminPosts, AdminComments, AdminReports, AdminRoles, AdminUsers } from "./pages/Admin";
import { CurrentUserProvider, useCurrentUser } from "./context/currentUserContext"; // Đã gộp useCurrentUser và CurrentUserProvider
import "./App.css";

const RouteApp = () => {
  const context = useCurrentUser();
  return (
      <Router>
        <Routes>
          {/* Public routes - không có Navbar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

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
            {/* Thêm route mới ở đây, tự động có Navbar */}
          </Route>

          {/* Admin routes - có AdminLayout riêng */}
          <Route element={<ProtectedRoute user={context.currentUser} isLoading={context.isLoading} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route element={<PermissionRoute user={context.currentUser} permission="dashboard" />}>
                <Route path="dashboard" element={<AdminDashboard />} />
              </Route>

              <Route element={<PermissionRoute user={context.currentUser} permission="user" />}>
                <Route path="users" element={<AdminUsers />} />
              </Route>

              <Route element={<PermissionRoute user={context.currentUser} permission="posts" />}>
                <Route path="posts" element={<AdminPosts />} />
              </Route>

              <Route element={<PermissionRoute user={context.currentUser} permission="comments" />}>
                <Route path="comments" element={<AdminComments />} />
              </Route>

              <Route element={<PermissionRoute user={context.currentUser} permission="reports" />}>
                <Route path="reports" element={<AdminReports />} />
              </Route>

              <Route element={<PermissionRoute user={context.currentUser} permission="roles" />}>
                <Route path="roles" element={<AdminRoles />} />
              </Route>
            </Route>
          </Route>
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