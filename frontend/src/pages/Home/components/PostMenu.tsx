import React, { useState, useRef, useEffect } from "react";
import "./PostMenu.css";

interface PostMenuProps {
    isOwner: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

const PostMenu: React.FC<PostMenuProps> = ({ isOwner, onEdit, onDelete }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showDropdown]);

    const handleEditClick = () => {
        setShowDropdown(false);
        onEdit?.();
    };

    const handleDeleteClick = () => {
        setShowDropdown(false);
        onDelete?.();
    };

    if (!isOwner) return null;

    return (
        <div className="post-menu" ref={dropdownRef}>
            <button
                className="post-menu-trigger"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                }}
                aria-label="Tùy chọn bài viết"
                title="Tùy chọn"
            >
                •••
            </button>

            {showDropdown && (
                <div className="post-menu-dropdown">
                    <button className="post-menu-item" onClick={handleEditClick}>
                        <span className="post-menu-icon">✏️</span>
                        <span>Chỉnh sửa bài viết</span>
                    </button>
                    <button className="post-menu-item post-menu-danger" onClick={handleDeleteClick}>
                        <span className="post-menu-icon">🗑️</span>
                        <span>Xóa bài viết</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostMenu;
