import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "../../ui";
import "./UserCard.css";

export interface UserCardData {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    bio: string | null;
    isVerified?: boolean;
    mutualFriends?: number;
}

export type UserCardVariant = 'default' | 'suggestion' | 'request' | 'friend' | 'blocked';

export interface UserCardProps {
    user: UserCardData;
    onClick?: () => void;
    variant?: UserCardVariant;
    onPrimaryAction?: () => void;
    onSecondaryAction?: () => void;
    onBlock?: () => void;
    isLoading?: boolean;
    showAction?: boolean;
}

/**
 * Reusable User Card Component with multiple variants
 * - default: Single action button
 * - suggestion: "Kết bạn" + "Xóa" buttons
 * - request: "Chấp nhận" + "Từ chối" buttons
 * - friend: "Nhắn tin" + dropdown menu
 * - blocked: "Bỏ chặn" button
 */
const UserCard: React.FC<UserCardProps> = ({
    user,
    onClick,
    variant = 'default',
    onPrimaryAction,
    onSecondaryAction,
    onBlock,
    isLoading = false,
    showAction = true,
}) => {
    const displayName = `${user.lastName} ${user.firstName}`;
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
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handlePrimaryClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isLoading) {
            onPrimaryAction?.();
        }
    };

    const handleSecondaryClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isLoading) {
            onSecondaryAction?.();
        }
    };

    const handleDropdownToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    const handleBlockClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDropdown(false);
        onBlock?.();
    };

    const handleUnfriendClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDropdown(false);
        onSecondaryAction?.();
    };

    const renderActions = () => {
        if (!showAction) return null;

        switch (variant) {
            case 'suggestion':
                return (
                    <div className="user-card-actions">
                        <button
                            className={`user-card-action primary ${isLoading ? 'loading' : ''}`}
                            onClick={handlePrimaryClick}
                            disabled={isLoading}
                        >
                            {isLoading ? <span className="spinner" /> : 'Kết bạn'}
                        </button>
                        <button
                            className="user-card-action secondary"
                            onClick={handleSecondaryClick}
                            disabled={isLoading}
                        >
                            Xóa
                        </button>
                    </div>
                );

            case 'request':
                return (
                    <div className="user-card-actions">
                        <button
                            className={`user-card-action primary ${isLoading ? 'loading' : ''}`}
                            onClick={handlePrimaryClick}
                            disabled={isLoading}
                        >
                            {isLoading ? <span className="spinner" /> : 'Chấp nhận'}
                        </button>
                        <button
                            className="user-card-action secondary"
                            onClick={handleSecondaryClick}
                            disabled={isLoading}
                        >
                            Từ chối
                        </button>
                    </div>
                );

            case 'friend':
                return (
                    <div className="user-card-actions" ref={dropdownRef}>
                        <button
                            className="user-card-action primary"
                            onClick={handlePrimaryClick}
                        >
                            Nhắn tin
                        </button>
                        <button
                            className="user-card-action icon-btn"
                            onClick={handleDropdownToggle}
                        >
                            ⋮
                        </button>
                        {showDropdown && (
                            <div className="user-card-dropdown">
                                <button
                                    className="dropdown-item"
                                    onClick={handleUnfriendClick}
                                >
                                    Hủy kết bạn
                                </button>
                                <button
                                    className="dropdown-item danger"
                                    onClick={handleBlockClick}
                                >
                                    Chặn
                                </button>
                            </div>
                        )}
                    </div>
                );

            case 'blocked':
                return (
                    <div className="user-card-actions">
                        <button
                            className={`user-card-action unblock ${isLoading ? 'loading' : ''}`}
                            onClick={handlePrimaryClick}
                            disabled={isLoading}
                        >
                            {isLoading ? <span className="spinner" /> : 'Bỏ chặn'}
                        </button>
                    </div>
                );

            default:
                return (
                    <button
                        className="user-card-action"
                        onClick={handlePrimaryClick}
                    >
                        Kết bạn
                    </button>
                );
        }
    };

    return (
        <div className={`user-card ${isLoading ? 'is-loading' : ''}`} onClick={onClick}>
            <div className="user-card-avatar">
                <Avatar
                    src={user.avatarUrl || undefined}
                    width={56}
                    height={56}
                >
                    {displayName[0]?.toUpperCase() || "U"}
                </Avatar>
                {user.isVerified && (
                    <span className="user-verified-badge">✓</span>
                )}
            </div>

            <div className="user-card-info">
                <div className="user-card-name">{displayName}</div>
                {user.bio && (
                    <div className="user-card-bio">{user.bio}</div>
                )}
                {user.mutualFriends && user.mutualFriends > 0 && (
                    <div className="user-card-mutual">
                        {user.mutualFriends} bạn chung
                    </div>
                )}
            </div>

            {renderActions()}
        </div>
    );
};

export default UserCard;
