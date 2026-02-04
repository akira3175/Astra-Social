import React, { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "../../components/ui";
import Navbar from "./components/Navbar";

interface BasePageProps {
    children?: ReactNode;
}

/**
 * BasePage - Layout component với Navbar
 * 
 * Có 2 cách sử dụng:
 * 
 * 1. Làm Layout Route (khuyến khích):
 *    ```jsx
 *    <Route element={<BasePage />}>
 *      <Route path="/profile/:userId" element={<ProfilePage />} />
 *      <Route path="/settings" element={<SettingsPage />} />
 *    </Route>
 *    ```
 * 
 * 2. Wrap trực tiếp (khi cần):
 *    ```jsx
 *    <BasePage>
 *      <YourContent />
 *    </BasePage>
 *    ```
 */
const BasePage: React.FC<BasePageProps> = ({ children }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: "100%",
                maxWidth: "100%",
                margin: 0,
                padding: 0,
                boxSizing: "border-box",
                overflow: "hidden",
                background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            }}
        >
            <Navbar />
            {/* Spacer for fixed Navbar */}
            <Box sx={{ height: "64px", flexShrink: 0 }} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: "100%",
                    boxSizing: "border-box",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative"
                }}
            >
                {/* Render children nếu được truyền vào, hoặc Outlet cho nested routes */}
                {children || <Outlet />}
            </Box>
        </Box>
    );
};

export default BasePage;
