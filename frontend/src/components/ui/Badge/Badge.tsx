import React from "react";
import "./Badge.css";

interface BadgeProps {
    badgeContent?: React.ReactNode;
    color?: "primary" | "secondary" | "error" | "default";
    invisible?: boolean;
    children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    badgeContent,
    color = "default",
    invisible = false,
    children,
}) => {
    if (invisible || !badgeContent) {
        return <div className="badge-container">{children}</div>;
    }

    return (
        <div className="badge-container">
            {children}
            <span className={`badge-badge badge-${color} ${invisible ? 'badge-invisible' : ''}`}>
                {badgeContent}
            </span>
        </div>
    );
};
