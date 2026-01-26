/* Card Component */

import React from "react";
import "./Card.css";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    elevation?: 0 | 1 | 2 | 3;
}

export const Card: React.FC<CardProps> = ({
    children,
    elevation = 1,
    className = "",
    ...props
}) => {
    return (
        <div className={`card card-elevation-${elevation} ${className}`} {...props}>
            {children}
        </div>
    );
};

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    title?: React.ReactNode;
    subheader?: React.ReactNode;
    action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    subheader,
    action,
    className = "",
    ...props
}) => {
    return (
        <div className={`card-header ${className}`} {...props}>
            <div className="card-header-content">
                {title && <h3 className="card-title">{title}</h3>}
                {subheader && <p className="card-subheader">{subheader}</p>}
            </div>
            {action && <div className="card-header-action">{action}</div>}
        </div>
    );
};

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

export const CardContent: React.FC<CardContentProps> = ({
    children,
    className = "",
    ...props
}) => {
    return (
        <div className={`card-content ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;
