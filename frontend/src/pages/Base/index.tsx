import React, { ReactNode } from "react";
import { Box } from "../../components/ui";
import Navbar from "./components/Navbar";

interface BasePageProps {
    children: ReactNode;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
    disablePadding?: boolean;
}

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
                {children}
            </Box>
        </Box>
    );
};

export default BasePage;
