import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Auth";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import MessagesPage from "./pages/Messages";
import SearchPage from "./pages/Search";
import BasePage from "./pages/Base";
// import HomeAdminPage from "./pages/HomeAdmin";
import AdminPage from "./pages/Admin"
import ReportPage from "./pages/Report";
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
            {/* Thêm route mới ở đây, tự động có Navbar */}
          </Route>

          <Route path="/admin" element={<AdminPage/>}>
            <Route path="report" element={<ReportPage/>} />
          </Route>
          
        </Routes>
      </Router>
    </CurrentUserProvider>
  );
}

export default App;
