import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../../../components/ui";
import { useCurrentUser } from "../../../context/currentUserContext";
import "./RightSidebar.css";

interface Friend {
    id: number;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string;
    };
    friend: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string;
    };
}

interface RightSidebarProps {
    className?: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ className }) => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const { currentUser } = useCurrentUser() ?? {};

    useEffect(() => {
        // Mock data - replace with actual API call
        setFriends([]);
    }, [currentUser?.id]);

    return (
        <div className={`right-sidebar ${className || ""}`}>
            <h3 className="section-title">Bạn bè</h3>

            {friends.length === 0 ? (
                <div className="empty-friends">
                    <div className="empty-friends-icon">👥</div>
                    <p className="empty-friends-text">Chưa có bạn bè nào</p>
                </div>
            ) : (
                <div className="friends-list">
                    {friends.map((friend) => {
                        const friendUser =
                            String(friend.user.id) === String(currentUser?.id) ? friend.friend : friend.user;
                        return (
                            <Link
                                key={friend.id}
                                to={`/profile/${friendUser.email}`}
                                className="friend-item"
                            >
                                <Avatar
                                    src={friendUser.avatar}
                                    alt={`${friendUser.firstName} ${friendUser.lastName}`}
                                    className="friend-avatar"
                                    width={44}
                                    height={44}
                                />
                                <div className="friend-info">
                                    <span className="friend-name">
                                        {friendUser.firstName} {friendUser.lastName}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            <div className="sidebar-footer">
                <span className="sidebar-footer-text">© 2025 AstraSocial</span>
                <div className="sidebar-footer-links">
                    <a href="/about">Giới thiệu</a>
                    <a href="/terms">Điều khoản</a>
                    <a href="/privacy">Quyền riêng tư</a>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
