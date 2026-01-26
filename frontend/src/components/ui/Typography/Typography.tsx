/* Typography Component */

import React, { JSX } from "react";
import "./Typography.css";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2" | "caption";
    component?: keyof JSX.IntrinsicElements;
    color?: "primary" | "secondary" | "error" | "inherit";
    align?: "left" | "center" | "right";
    gutterBottom?: boolean;
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = "body1",
    component,
    color = "inherit",
    align = "left",
    gutterBottom = false,
    className = "",
    ...props
}) => {
    const defaultComponents: Record<string, keyof JSX.IntrinsicElements> = {
        h1: "h1",
        h2: "h2",
        h3: "h3",
        h4: "h4",
        h5: "h5",
        h6: "h6",
        body1: "p",
        body2: "p",
        caption: "span",
    };

    const Component = (component || defaultComponents[variant] || "p") as React.ElementType;

    const classes = [
        "typography",
        `typography-${variant}`,
        `typography-${color}`,
        `typography-align-${align}`,
        gutterBottom ? "typography-gutter-bottom" : "",
        className,
    ].filter(Boolean).join(" ");

    return (
        <Component className={classes} {...props}>
            {children}
        </Component>
    );
};

export default Typography;
