/* TextField Component */

import React, { useState } from "react";
import "./TextField.css";

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    variant?: "outlined" | "filled";
    size?: "small" | "medium";
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({
    label,
    error = false,
    helperText,
    fullWidth = false,
    variant = "outlined",
    size = "medium",
    startAdornment,
    endAdornment,
    className = "",
    id,
    ...props
}) => {
    const [focused, setFocused] = useState(false);

    const containerClasses = [
        "textfield",
        `textfield-${variant}`,
        `textfield-${size}`,
        fullWidth ? "textfield-full-width" : "",
        error ? "textfield-error" : "",
        focused ? "textfield-focused" : "",
        className,
    ].filter(Boolean).join(" ");

    return (
        <div className={containerClasses}>
            {label && (
                <label htmlFor={id} className="textfield-label">
                    {label}
                </label>
            )}
            <div className="textfield-input-wrapper">
                {startAdornment && (
                    <span className="textfield-adornment textfield-start-adornment">
                        {startAdornment}
                    </span>
                )}
                <input
                    id={id}
                    className="textfield-input"
                    onFocus={(e) => {
                        setFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        props.onBlur?.(e);
                    }}
                    {...props}
                />
                {endAdornment && (
                    <span className="textfield-adornment textfield-end-adornment">
                        {endAdornment}
                    </span>
                )}
            </div>
            {helperText && (
                <span className={`textfield-helper ${error ? "textfield-helper-error" : ""}`}>
                    {helperText}
                </span>
            )}
        </div>
    );
};

export default TextField;
