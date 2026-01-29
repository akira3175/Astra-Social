import React from "react";
import "./Avatar.css";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    width = 40,
    height = 40,
    className = "",
    style,
    children,
    ...props
}) => {
    const sizeStyle = {
        width: width,
        height: height,
        ...style,
    };

    return (
        <div className={`avatar ${className}`} style={sizeStyle} {...props}>
            {src ? (
                <img src={src} alt={alt} className="avatar-img" />
            ) : (
                children || (alt ? alt.charAt(0).toUpperCase() : null)
            )}
        </div>
    );
};
