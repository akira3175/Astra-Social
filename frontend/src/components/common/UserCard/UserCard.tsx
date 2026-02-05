import React from "react";
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

export interface UserCardProps {
    user: UserCardData;
    onClick?: () => void;
    actionLabel?: string;
    onAction?: () => void;
    showAction?: boolean;
}

/**
 * Reusable User Card Component
 */
const UserCard: React.FC<UserCardProps> = ({
    user,
    onClick,
    actionLabel = "Kết bạn",
    onAction,
    showAction = true,
}) => {
    const displayName = `${user.lastName} ${user.firstName}`;

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAction?.();
    };

    return (
        <div className="user-card" onClick={onClick}>
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

            {showAction && (
                <button
                    className="user-card-action"
                    onClick={handleActionClick}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default UserCard;
