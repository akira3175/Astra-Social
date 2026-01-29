import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/Auth";
import HomePage from "./pages/Home";
import { CurrentUserProvider } from "./context/currentUserContext";
import "./App.css";

function App() {
  return (
    <CurrentUserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </CurrentUserProvider>
  );
}

export default App;
