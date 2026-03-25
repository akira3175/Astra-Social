import React, { useState, useMemo } from "react";
import { SearchIcon, PlusIcon } from "../../../components/ui";
import type { Conversation } from "../../../types/message";
import type { Friend } from "../../../types/friendship";

interface ConversationListProps {
    conversations: Conversation[];
    friends: Friend[]; // Mảng bạn bè
    selectedId: string | null;
    onSelect: (item: any, type: 'chat' | 'friend') => void;
    currentUserId: string;
    onCreateNewGroup?: () => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    friends,
    selectedId,
    onSelect,
    currentUserId,
    onCreateNewGroup,
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    const getDisplayName = (conversation: Conversation): string => {
        if (conversation.type === "GROUP" && conversation.name) {
            return conversation.name;
        }

        const otherMember = conversation.members?.find(
            (m: any) => String(m.userId || m.user_id) !== String(currentUserId)
        );

        if (otherMember?.user) {
            const { firstName, lastName, username } = otherMember.user;
            if (firstName || lastName) return `${lastName || ""} ${firstName || ""}`.trim();
            return username;
        }
    
        return "Người dùng";
    };

    const getAvatarInitial = (conversation: Conversation): string => {
        return getDisplayName(conversation).charAt(0).toUpperCase();
    };

    const getAvatarUrl = (conversation: Conversation): string | undefined => {
        if (conversation.type === "GROUP") return conversation.imageUrl;
        const otherMember = conversation.members.find((m: any) => String(m.userId || m.user_id) !== String(currentUserId));
        return (otherMember?.user as any)?.avatar || (otherMember?.user as any)?.avatarUrl;
    };

    const formatTime = (dateString: string | undefined): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
        if (diffDays === 1) return "Hôm qua";
        if (diffDays < 7) {
            const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
            return days[date.getDay()];
        }
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    };

    const getPreviewText = (conversation: Conversation): string => {
        if (!conversation.lastMessage) return "Chưa có tin nhắn";
        const isMine = String(conversation.lastMessage.senderId) === String(currentUserId);
        const prefix = isMine ? "Bạn: " : "";
        
        if (!conversation.lastMessage.content && conversation.lastMessage.attachments?.length) {
             return prefix + "Đã gửi một tệp đính kèm";
        }
        return prefix + (conversation.lastMessage.content || "");
    };

    const getFriendName = (friend: Friend): string => {
        const { firstName, lastName, username } = friend.user;
        if (firstName || lastName) return `${lastName || ""} ${firstName || ""}`.trim();
        return username;
    };

    const filteredConversations = useMemo(() => {
        if (!searchQuery.trim()) return conversations;
        const query = searchQuery.toLowerCase();
        return conversations.filter(conv => getDisplayName(conv).toLowerCase().includes(query));
    }, [conversations, searchQuery, currentUserId]);

    const filteredFriends = useMemo(() => {
        const query = searchQuery.toLowerCase();
        
        return friends.filter(friend => {
            // Loại bỏ chính mình (nếu có trong list bạn bè)
            if (String(friend.user.id) === String(currentUserId)) return false;

            const hasConversation = conversations.some(conv => 
                conv.type === "PRIVATE" && 
                conv.members.some((m: any) => String(m.userId || m.user_id) === String(friend.user.id))
            );
            
            if (hasConversation) return false;

            if (searchQuery.trim()) {
                return getFriendName(friend).toLowerCase().includes(query);
            }
            return true; 
        });
    }, [friends, conversations, searchQuery, currentUserId]);

    const isEmpty = filteredConversations.length === 0 && filteredFriends.length === 0;

    return (
        <div className="conversation-list">
            <div className="conversation-list-header">
                <div className="header-title-row">
                    <h2>Tin nhắn</h2>
                    {onCreateNewGroup && (
                        <button
                            className="create-group-btn"
                            onClick={onCreateNewGroup}
                            title="Tạo nhóm mới"
                        >
                            <PlusIcon size={20} />
                        </button>
                    )}
                </div>
                <div className="conversation-search">
                    <span className="search-icon">
                        <SearchIcon size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="conversation-items">
                {isEmpty ? (
                    <div className="empty-conversations">
                        <p>Không tìm thấy kết quả</p>
                    </div>
                ) : (
                    <>
                        {filteredConversations.map((conversation) => {
                            const isSelected = selectedId === conversation.id;
                            const hasUnread = (conversation.unreadCount || 0) > 0;
                            const avatarUrl = getAvatarUrl(conversation);

                            return (
                                <div
                                    key={`conv_${conversation.id}`}
                                    className={`conversation-item ${isSelected ? "active" : ""} ${hasUnread ? "unread" : ""}`}
                                    onClick={() => onSelect(conversation, 'chat')}
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
                        })}

                        {/* 2. HIỂN THỊ BẠN BÈ GỢI Ý (CHƯA TỪNG CHAT) */}
                        {filteredFriends.length > 0 && (
                            <>
                                <div className="conversation-section-header">
                                    <span>BẮT ĐẦU TRÒ CHUYỆN MỚI</span>
                                </div>
                                
                                {filteredFriends.map((friend) => {
                                    const isSelected = selectedId === `temp_${friend.user.id}`;
                                    const avatarUrl = friend.user.avatarUrl || (friend.user as any).avatar;

                                    return (
                                        <div
                                            key={`friend_${friend.user.id}`}
                                            className={`conversation-item suggestion ${isSelected ? "active" : ""}`}
                                            onClick={() => onSelect(friend, 'friend')}
                                        >
                                            <div className="conversation-avatar">
                                                {avatarUrl ? (
                                                    <img src={avatarUrl} alt="" />
                                                ) : (
                                                    getFriendName(friend).charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="conversation-content justify-center">
                                                <div className="conversation-header">
                                                    <span className="conversation-name font-medium">
                                                        {getFriendName(friend)}
                                                    </span>
                                                </div>
                                                <div className="conversation-preview">
                                                    <span className="preview-text">
                                                        Bạn bè • Gợi ý nhắn tin
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ConversationList;