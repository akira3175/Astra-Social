/* Box Component - Flexible container */

import React, { JSX } from "react";
import "./Box.css";

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    component?: keyof JSX.IntrinsicElements;
    sx?: React.CSSProperties;
}

export const Box: React.FC<BoxProps> = ({
    children,
    component: Component = "div",
    sx,
    className = "",
    style,
    ...props
}) => {
    const Element = Component as React.ElementType;
    return (
        <Element
            className={`box ${className}`}
            style={{ ...sx, ...style }}
            {...props}
        >
            {children}
        </Element>
    );
};

export default Box;
