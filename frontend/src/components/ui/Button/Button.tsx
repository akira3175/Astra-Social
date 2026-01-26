/* Button Component */

import React from "react";
import "./Button.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "contained" | "outlined" | "text";
    color?: "primary" | "secondary" | "error" | "success";
    size?: "small" | "medium" | "large";
    fullWidth?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = "contained",
    color = "primary",
    size = "medium",
    fullWidth = false,
    startIcon,
    endIcon,
    loading = false,
    className = "",
    disabled,
    ...props
}) => {
    const classes = [
        "btn",
        `btn-${variant}`,
        `btn-${color}`,
        `btn-${size}`,
        fullWidth ? "btn-full-width" : "",
        loading ? "btn-loading" : "",
        className,
    ].filter(Boolean).join(" ");

    return (
        <button className={classes} disabled={disabled || loading} {...props}>
            {loading && <span className="btn-spinner"></span>}
            {!loading && startIcon && <span className="btn-icon btn-start-icon">{startIcon}</span>}
            <span className="btn-label">{children}</span>
            {!loading && endIcon && <span className="btn-icon btn-end-icon">{endIcon}</span>}
        </button>
    );
};

export default Button;
