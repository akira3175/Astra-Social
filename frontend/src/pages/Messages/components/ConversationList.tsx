import React, { useState, useMemo } from "react";
import { SearchIcon } from "../../../components/ui";
import type { Conversation } from "../../../types/message";

interface ConversationListProps {
    conversations: Conversation[];
    selectedId: string | null;
    onSelect: (conversation: Conversation) => void;
    currentUserId: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    selectedId,
    onSelect,
    currentUserId,
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Get display name for conversation
    const getDisplayName = (conversation: Conversation): string => {
        if (conversation.type === "GROUP" && conversation.name) {
            return conversation.name;
        }
        // For private chat, show the other person's name
        const otherMember = conversation.members.find(m => m.userId !== currentUserId);
        if (otherMember?.user) {
            const { firstName, lastName, username } = otherMember.user;
            if (firstName || lastName) {
                return `${firstName || ""} ${lastName || ""}`.trim();
            }
            return username;
        }
        return "Unknown";
    };

    // Get avatar initial
    const getAvatarInitial = (conversation: Conversation): string => {
        const name = getDisplayName(conversation);
        return name.charAt(0).toUpperCase();
    };

    // Get avatar URL
    const getAvatarUrl = (conversation: Conversation): string | undefined => {
        if (conversation.type === "GROUP") {
            return conversation.imageUrl;
        }
        const otherMember = conversation.members.find(m => m.userId !== currentUserId);
        return otherMember?.user?.avatar;
    };

    // Format time
    const formatTime = (dateString: string | undefined): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
        } else if (diffDays === 1) {
            return "Hôm qua";
        } else if (diffDays < 7) {
            const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
            return days[date.getDay()];
        }
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    };

    // Get preview text
    const getPreviewText = (conversation: Conversation): string => {
        if (!conversation.lastMessage) return "Chưa có tin nhắn";
        const isMine = conversation.lastMessage.senderId === currentUserId;
        const prefix = isMine ? "Bạn: " : "";
        return prefix + (conversation.lastMessage.content || "");
    };

    // Filter conversations by search
    const filteredConversations = useMemo(() => {
        if (!searchQuery.trim()) return conversations;
        const query = searchQuery.toLowerCase();
        return conversations.filter(conv => {
            const name = getDisplayName(conv).toLowerCase();
            return name.includes(query);
        });
    }, [conversations, searchQuery, currentUserId]);

    return (
        <div className="conversation-list">
            <div className="conversation-list-header">
                <h2>Tin nhắn</h2>
                <div className="conversation-search">
                    <span className="search-icon">
                        <SearchIcon size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm cuộc trò chuyện..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="conversation-items">
                {filteredConversations.length === 0 ? (
                    <div className="empty-conversations">
                        <p>Không tìm thấy cuộc trò chuyện</p>
                    </div>
                ) : (
                    filteredConversations.map((conversation) => {
                        const isSelected = selectedId === conversation.id;
                        const hasUnread = (conversation.unreadCount || 0) > 0;
                        const avatarUrl = getAvatarUrl(conversation);

                        return (
                            <div
                                key={conversation.id}
                                className={`conversation-item ${isSelected ? "active" : ""} ${hasUnread ? "unread" : ""}`}
                                onClick={() => onSelect(conversation)}
                            >
                                <div className={`conversation-avatar ${conversation.type === "GROUP" ? "group-avatar" : ""}`}>
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="" />
                                    ) : (
                                        getAvatarInitial(conversation)
                                    )}
                                </div>
                                <div className="conversation-content">
                                    <div className="conversation-header">
                                        <span className="conversation-name">
                                            {getDisplayName(conversation)}
                                        </span>
                                        <span className="conversation-time">
                                            {formatTime(conversation.lastMessageAt)}
                                        </span>
                                    </div>
                                    <div className="conversation-preview">
                                        <span className="preview-text">
                                            {getPreviewText(conversation)}
                                        </span>
                                        {hasUnread && (
                                            <span className="unread-badge">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ConversationList;
