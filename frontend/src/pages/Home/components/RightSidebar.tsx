import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "../../../components/ui";
import { UserCard } from "../../../components/common";
import type { UserCardData } from "../../../components/common/UserCard/UserCard";
import { useCurrentUser } from "../../../context/currentUserContext";
import { getFriendSuggestions, getFriends, sendFriendRequest, removeSuggestion } from "../../../services/friendshipService";
import type { FriendSuggestion, Friend } from "../../../types/friendship";
import "./RightSidebar.css";

interface RightSidebarProps {
    className?: string;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ className }) => {
    const navigate = useNavigate();
    const { currentUser } = useCurrentUser() ?? {};

    const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loadingIds, setLoadingIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suggestionsData, friendsData] = await Promise.all([
                    getFriendSuggestions(),
                    getFriends(),
                ]);
                setSuggestions(suggestionsData.slice(0, 3));
                setFriends(friendsData);
            } catch (error) {
                console.error("Error fetching sidebar data:", error);
            }
        };

        if (currentUser?.id) {
            fetchData();
        }
    }, [currentUser?.id]);

    const handleSendRequest = async (suggestion: FriendSuggestion) => {
        setLoadingIds(prev => new Set(prev).add(suggestion.id));
        try {
            await sendFriendRequest(suggestion.user.id);
            setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
        } finally {
            setLoadingIds(prev => {
                const next = new Set(prev);
                next.delete(suggestion.id);
                return next;
            });
        }
    };

    const handleRemoveSuggestion = async (suggestionId: number) => {
        await removeSuggestion(suggestionId);
        setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    };

    const toUserCardData = (user: FriendSuggestion["user"]): UserCardData => ({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        isVerified: user.isVerified,
        mutualFriends: user.mutualFriends,
    });

    return (
        <div className={`right-sidebar ${className || ""}`}>
            {/* Friend Suggestions Section */}
            {suggestions.length > 0 && (
                <div className="sidebar-section">
                    <div className="section-header">
                        <h3 className="section-title">Gợi ý kết bạn</h3>
                        <Link to="/friends" className="section-link">
                            Xem tất cả
                        </Link>
                    </div>
                    <div className="suggestions-list">
                        {suggestions.map(suggestion => (
                            <UserCard
                                key={suggestion.id}
                                user={toUserCardData(suggestion.user)}
                                variant="suggestion"
                                onClick={() => navigate(`/profile/${suggestion.user.id}`)}
                                onPrimaryAction={() => handleSendRequest(suggestion)}
                                onSecondaryAction={() => handleRemoveSuggestion(suggestion.id)}
                                isLoading={loadingIds.has(suggestion.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Friends List Section */}
            <div className="sidebar-section">
                <div className="section-header">
                    <h3 className="section-title">Bạn bè</h3>
                    {friends.length > 0 && (
                        <Link to="/friends?tab=friends" className="section-link">
                            Xem tất cả
                        </Link>
                    )}
                </div>

                {friends.length === 0 ? (
                    <div className="empty-friends">
                        <div className="empty-friends-icon">👥</div>
                        <p className="empty-friends-text">Chưa có bạn bè nào</p>
                    </div>
                ) : (
                    <div className="friends-list">
                        {friends.slice(0, 5).map((friend) => (
                            <Link
                                key={friend.friendshipId}
                                to={`/profile/${friend.user.id}`}
                                className="friend-item"
                            >
                                <Avatar
                                    src={friend.user.avatarUrl || undefined}
                                    alt={`${friend.user.firstName} ${friend.user.lastName}`}
                                    className="friend-avatar"
                                    width={44}
                                    height={44}
                                />
                                <div className="friend-info">
                                    <span className="friend-name">
                                        {friend.user.lastName} {friend.user.firstName}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

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
