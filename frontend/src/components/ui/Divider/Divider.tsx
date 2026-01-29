import React from "react";
import "./Divider.css";

export const Divider: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({ className = "", ...props }) => {
    return <hr className={`divider ${className}`} {...props} />;
};
