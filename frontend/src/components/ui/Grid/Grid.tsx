/* Grid Component */

import React from "react";
import "./Grid.css";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    container?: boolean;
    item?: boolean;
    spacing?: 0 | 1 | 2 | 3 | 4 | 5;
    xs?: number | "auto";
    sm?: number | "auto";
    md?: number | "auto";
    lg?: number | "auto";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around";
}

export const Grid: React.FC<GridProps> = ({
    children,
    container = false,
    item = false,
    spacing = 0,
    xs,
    sm,
    md,
    lg,
    alignItems,
    justifyContent,
    className = "",
    style,
    ...props
}) => {
    const classes = [
        container ? "grid-container" : "",
        item ? "grid-item" : "",
        container && spacing ? `grid-spacing-${spacing}` : "",
        xs ? `grid-xs-${xs}` : "",
        sm ? `grid-sm-${sm}` : "",
        md ? `grid-md-${md}` : "",
        lg ? `grid-lg-${lg}` : "",
        className,
    ].filter(Boolean).join(" ");

    const inlineStyles: React.CSSProperties = {
        ...style,
        ...(alignItems && { alignItems }),
        ...(justifyContent && { justifyContent }),
    };

    return (
        <div className={classes} style={inlineStyles} {...props}>
            {children}
        </div>
    );
};

export default Grid;
