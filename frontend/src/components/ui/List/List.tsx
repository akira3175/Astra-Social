import React from "react";
import "./List.css";

// List
export const List: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({ children, className = "", ...props }) => {
    return (
        <ul className={`list ${className}`} {...props}>
            {children}
        </ul>
    );
};

// ListItem
interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    component?: React.ElementType; // To support 'Link'
    to?: string;
    button?: boolean; // For compatibility
}

export const ListItem: React.FC<ListItemProps> = ({
    children,
    className = "",
    component,
    ...props
}) => {
    const Component = component || "li";
    return (
        <Component className={`list-item ${className}`} {...props}>
            {children}
        </Component>
    );
};

// ListItemIcon
export const ListItemIcon: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => {
    return (
        <div className={`list-item-icon ${className}`} {...props}>
            {children}
        </div>
    );
};

// ListItemText
interface ListItemTextProps extends React.HTMLAttributes<HTMLDivElement> {
    primary?: React.ReactNode;
    secondary?: React.ReactNode;
}

export const ListItemText: React.FC<ListItemTextProps> = ({
    primary,
    secondary,
    className = "",
    ...props
}) => {
    return (
        <div className={`list-item-text ${className}`} {...props}>
            {primary && <span className="list-item-text-primary">{primary}</span>}
            {secondary && <p className="list-item-text-secondary">{secondary}</p>}
        </div>
    );
};
