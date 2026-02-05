import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserCard } from "../../components/common";
import type { UserCardData } from "../../components/common/UserCard/UserCard";
import {
    getFriendSuggestions,
    getFriendRequests,
    getFriends,
    getBlockedUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeSuggestion,
    unfriend,
    blockUser,
    unblockUser,
} from "../../services/friendshipService";
import type {
    FriendSuggestion,
    FriendRequest,
    Friend,
    BlockedUser,
} from "../../types/friendship";
import "./FriendsPage.css";

type FriendsTab = "suggestions" | "requests" | "friends" | "blocked";

/**
 * Friends Page Component
 * Displays friend suggestions, requests, friends list, and blocked users
 */
const FriendsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get initial tab from URL
    const initialTab = (searchParams.get("tab") as FriendsTab) || "suggestions";
    const [activeTab, setActiveTab] = useState<FriendsTab>(initialTab);

    // Data states
    const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [blocked, setBlocked] = useState<BlockedUser[]>([]);

    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [loadingActions, setLoadingActions] = useState<Set<number>>(new Set());

    // Fetch data based on active tab
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            switch (activeTab) {
                case "suggestions":
                    setSuggestions(await getFriendSuggestions());
                    break;
                case "requests":
                    setRequests(await getFriendRequests());
                    break;
                case "friends":
                    setFriends(await getFriends());
                    break;
                case "blocked":
                    setBlocked(await getBlockedUsers());
                    break;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle tab change
    const handleTabChange = (tab: FriendsTab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    // Set loading for a specific item
    const setItemLoading = (id: number, loading: boolean) => {
        setLoadingActions(prev => {
            const next = new Set(prev);
            if (loading) next.add(id);
            else next.delete(id);
            return next;
        });
    };

    // Navigate to user profile
    const handleUserClick = (userId: number) => {
        navigate(`/profile/${userId}`);
    };

    // Navigate to message
    const handleMessage = (userId: number) => {
        navigate(`/messages?user=${userId}`);
    };

    // === Suggestion Actions ===
    const handleSendRequest = async (suggestion: FriendSuggestion) => {
        setItemLoading(suggestion.id, true);
        try {
            await sendFriendRequest(suggestion.user.id);
            setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
        } finally {
            setItemLoading(suggestion.id, false);
        }
    };

    const handleRemoveSuggestion = async (suggestionId: number) => {
        await removeSuggestion(suggestionId);
        setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    };

    // === Request Actions ===
    const handleAcceptRequest = async (request: FriendRequest) => {
        setItemLoading(request.id, true);
        try {
            await acceptFriendRequest(request.id);
            setRequests(prev => prev.filter(r => r.id !== request.id));
        } finally {
            setItemLoading(request.id, false);
        }
    };

    const handleDeclineRequest = async (requestId: number) => {
        await declineFriendRequest(requestId);
        setRequests(prev => prev.filter(r => r.id !== requestId));
    };

    // === Friend Actions ===
    const handleUnfriend = async (friendshipId: number) => {
        await unfriend(friendshipId);
        setFriends(prev => prev.filter(f => f.friendshipId !== friendshipId));
    };

    const handleBlockFriend = async (friend: Friend) => {
        await blockUser(friend.user.id);
        setFriends(prev => prev.filter(f => f.friendshipId !== friend.friendshipId));
    };

    // === Blocked Actions ===
    const handleUnblock = async (blockedUser: BlockedUser) => {
        setItemLoading(blockedUser.friendshipId, true);
        try {
            await unblockUser(blockedUser.friendshipId);
            setBlocked(prev => prev.filter(b => b.friendshipId !== blockedUser.friendshipId));
        } finally {
            setItemLoading(blockedUser.friendshipId, false);
        }
    };

    // Convert to UserCardData
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

    // Render content based on active tab
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="friends-loading">
                    <div className="loading-spinner" />
                    <p>Đang tải...</p>
                </div>
            );
        }

        switch (activeTab) {
            case "suggestions":
                return suggestions.length === 0 ? (
                    <div className="friends-empty">
                        <div className="friends-empty-icon">🔍</div>
                        <h3>Không có gợi ý nào</h3>
                        <p>Hãy kết bạn với nhiều người hơn để nhận gợi ý mới</p>
                    </div>
                ) : (
                    <div className="friends-grid">
                        {suggestions.map(suggestion => (
                            <UserCard
                                key={suggestion.id}
                                user={toUserCardData(suggestion.user)}
                                variant="suggestion"
                                onClick={() => handleUserClick(suggestion.user.id)}
                                onPrimaryAction={() => handleSendRequest(suggestion)}
                                onSecondaryAction={() => handleRemoveSuggestion(suggestion.id)}
                                isLoading={loadingActions.has(suggestion.id)}
                            />
                        ))}
                    </div>
                );

            case "requests":
                return requests.length === 0 ? (
                    <div className="friends-empty">
                        <div className="friends-empty-icon">📬</div>
                        <h3>Không có lời mời nào</h3>
                        <p>Bạn chưa nhận được lời mời kết bạn nào</p>
                    </div>
                ) : (
                    <div className="friends-grid">
                        {requests.map(request => (
                            <UserCard
                                key={request.id}
                                user={toUserCardData(request.user)}
                                variant="request"
                                onClick={() => handleUserClick(request.user.id)}
                                onPrimaryAction={() => handleAcceptRequest(request)}
                                onSecondaryAction={() => handleDeclineRequest(request.id)}
                                isLoading={loadingActions.has(request.id)}
                            />
                        ))}
                    </div>
                );

            case "friends":
                return friends.length === 0 ? (
                    <div className="friends-empty">
                        <div className="friends-empty-icon">👥</div>
                        <h3>Chưa có bạn bè</h3>
                        <p>Hãy bắt đầu kết bạn với mọi người</p>
                    </div>
                ) : (
                    <div className="friends-grid">
                        {friends.map(friend => (
                            <UserCard
                                key={friend.friendshipId}
                                user={toUserCardData(friend.user)}
                                variant="friend"
                                onClick={() => handleUserClick(friend.user.id)}
                                onPrimaryAction={() => handleMessage(friend.user.id)}
                                onSecondaryAction={() => handleUnfriend(friend.friendshipId)}
                                onBlock={() => handleBlockFriend(friend)}
                            />
                        ))}
                    </div>
                );

            case "blocked":
                return blocked.length === 0 ? (
                    <div className="friends-empty">
                        <div className="friends-empty-icon">🚫</div>
                        <h3>Không có ai bị chặn</h3>
                        <p>Bạn chưa chặn người dùng nào</p>
                    </div>
                ) : (
                    <div className="friends-grid">
                        {blocked.map(blockedUser => (
                            <UserCard
                                key={blockedUser.friendshipId}
                                user={toUserCardData(blockedUser.user)}
                                variant="blocked"
                                onClick={() => { }}
                                onPrimaryAction={() => handleUnblock(blockedUser)}
                                isLoading={loadingActions.has(blockedUser.friendshipId)}
                            />
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="friends-page">
            {/* Header */}
            <div className="friends-header">
                <h1 className="friends-title">Bạn bè</h1>
            </div>

            {/* Tabs */}
            <div className="friends-tabs">
                <button
                    className={`friends-tab ${activeTab === "suggestions" ? "active" : ""}`}
                    onClick={() => handleTabChange("suggestions")}
                >
                    <span className="tab-icon">💡</span>
                    Gợi ý
                    {suggestions.length > 0 && activeTab !== "suggestions" && (
                        <span className="tab-badge">{suggestions.length}</span>
                    )}
                </button>
                <button
                    className={`friends-tab ${activeTab === "requests" ? "active" : ""}`}
                    onClick={() => handleTabChange("requests")}
                >
                    <span className="tab-icon">📨</span>
                    Lời mời
                    {requests.length > 0 && (
                        <span className="tab-badge highlight">{requests.length}</span>
                    )}
                </button>
                <button
                    className={`friends-tab ${activeTab === "friends" ? "active" : ""}`}
                    onClick={() => handleTabChange("friends")}
                >
                    <span className="tab-icon">👥</span>
                    Bạn bè
                </button>
                <button
                    className={`friends-tab ${activeTab === "blocked" ? "active" : ""}`}
                    onClick={() => handleTabChange("blocked")}
                >
                    <span className="tab-icon">🚫</span>
                    Đã chặn
                </button>
            </div>

            {/* Content */}
            <div className="friends-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default FriendsPage;
