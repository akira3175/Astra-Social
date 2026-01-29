import React, { useEffect, useRef, useState } from "react";
import "./Menu.css";

interface MenuProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    children: React.ReactNode;
    MenuListProps?: any;
    transformOrigin?: { vertical: "top" | "bottom"; horizontal: "left" | "right" };
    anchorOrigin?: { vertical: "top" | "bottom"; horizontal: "left" | "right" };
    id?: string;
}

export const Menu: React.FC<MenuProps> = ({
    open,
    anchorEl,
    onClose,
    children,
    id,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (open && anchorEl) {
            const rect = anchorEl.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            // Simple positioning: align bottom-right of anchor
            // Adjust this logic if you need exact MUI replication
            setPosition({
                top: rect.bottom + scrollY,
                left: rect.right + scrollX - (menuRef.current?.offsetWidth || 160), // Align right edges by default
            });
        }
    }, [open, anchorEl]);

    if (!open) return null;

    return (
        <>
            <div className="menu-overlay" onClick={onClose} />
            <div
                id={id}
                ref={menuRef}
                className="menu-paper"
                style={{ top: position.top, left: position.left }}
            >
                {children}
            </div>
        </>
    );
};

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLElement> {
    component?: React.ElementType; // To support 'Link' from react-router-dom
    to?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
    children,
    className = "",
    component,
    ...props
}) => {
    const Component = component || "div";
    return (
        <Component className={`menu-item ${className}`} role="menuitem" {...props}>
            {children}
        </Component>
    );
};
