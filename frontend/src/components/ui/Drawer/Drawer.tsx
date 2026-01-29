import React from "react";
import "./Drawer.css";

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    anchor?: "left" | "right";
    children: React.ReactNode;
    sx?: React.CSSProperties; // For compatibility
}

export const Drawer: React.FC<DrawerProps> = ({
    open,
    onClose,
    anchor = "left",
    children,
    sx
}) => {
    return (
        <>
            <div
                className={`drawer-overlay ${open ? "open" : ""}`}
                onClick={onClose}
            />
            <div
                className={`drawer-paper ${anchor === "right" ? "anchor-right" : ""} ${open ? "open" : ""}`}
                style={sx}
            >
                {children}
            </div>
        </>
    );
};
