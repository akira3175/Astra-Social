/* IconButton Component */

import React from "react";
import "./IconButton.css";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: "small" | "medium" | "large";
    color?: "default" | "primary" | "secondary" | "error";
}

export const IconButton: React.FC<IconButtonProps> = ({
    children,
    size = "medium",
    color = "default",
    className = "",
    ...props
}) => {
    const classes = [
        "icon-button",
        `icon-button-${size}`,
        `icon-button-${color}`,
        className,
    ].filter(Boolean).join(" ");

    return (
        <button type="button" className={classes} {...props}>
            {children}
        </button>
    );
};

export default IconButton;
