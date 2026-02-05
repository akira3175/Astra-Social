import React, { useState, useCallback, useLayoutEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import type { Conversation, Message, MessageUser } from "../../types/message";
import "./MessagesPage.css";

// Mock data for UI demonstration
const mockCurrentUser: MessageUser = {
    id: "1",
    username: "currentuser",
    firstName: "Current",
    lastName: "User",
    avatar: undefined,
};

const mockUsers: MessageUser[] = [
    { id: "2", username: "john_doe", firstName: "John", lastName: "Doe", avatar: undefined },
    { id: "3", username: "jane_smith", firstName: "Jane", lastName: "Smith", avatar: undefined },
    { id: "4", username: "bob_wilson", firstName: "Bob", lastName: "Wilson", avatar: undefined },
    { id: "5", username: "alice_brown", firstName: "Alice", lastName: "Brown", avatar: undefined },
];

const mockConversations: Conversation[] = [
    {
        id: "1",
        type: "PRIVATE",
        lastMessageAt: "2026-02-05T07:30:00Z",
        members: [
            { userId: "1", user: mockCurrentUser, role: "MEMBER", joinedAt: "2026-01-01T00:00:00Z" },
            { userId: "2", user: mockUsers[0], role: "MEMBER", joinedAt: "2026-01-01T00:00:00Z" },
        ],
        lastMessage: {
            id: "101",
            conversationId: "1",
            senderId: "2",
            content: "Chào bạn! Hôm nay thế nào?",
            type: "TEXT",
            isRead: false,
            createdAt: "2026-02-05T07:30:00Z",
        },
        unreadCount: 2,
    },
    {
        id: "2",
        type: "PRIVATE",
        lastMessageAt: "2026-02-05T06:15:00Z",
        members: [
            { userId: "1", user: mockCurrentUser, role: "MEMBER", joinedAt: "2026-01-01T00:00:00Z" },
            { userId: "3", user: mockUsers[1], role: "MEMBER", joinedAt: "2026-01-01T00:00:00Z" },
        ],
        lastMessage: {
            id: "102",
            conversationId: "2",
            senderId: "1",
            content: "Đã gửi file cho bạn rồi nhé!",
            type: "TEXT",
            isRead: true,
            createdAt: "2026-02-05T06:15:00Z",
        },
        unreadCount: 0,
    },
    {
        id: "3",
        type: "GROUP",
        name: "Team Frontend",
        imageUrl: undefined,
        lastMessageAt: "2026-02-04T22:00:00Z",
        members: [
            { userId: "1", user: mockCurrentUser, role: "ADMIN", joinedAt: "2026-01-01T00:00:00Z" },
            { userId: "2", user: mockUsers[0], role: "MEMBER", joinedAt: "2026-01-01T00:00:00Z" },
            { userId: "3", user: mockUsers[1], role: "MEMBER", joinedAt: "2026-01-01T00:00:00Z" },
            { userId: "4", user: mockUsers[2], role: "MEMBER", joinedAt: "2026-01-02T00:00:00Z" },
        ],
        lastMessage: {
            id: "103",
            conversationId: "3",
            senderId: "4",
            content: "Mọi người review PR giúp mình với!",
            type: "TEXT",
            isRead: true,
            createdAt: "2026-02-04T22:00:00Z",
        },
        unreadCount: 0,
    },
    {
        id: "4",
        type: "PRIVATE",
        lastMessageAt: "2026-02-04T18:30:00Z",
        members: [
            { userId: "1", user: mockCurrentUser, role: "MEMBER", joinedAt: "2026-01-01T00:00:00Z" },
            { userId: "5", user: mockUsers[3], role: "MEMBER", joinedAt: "2026-01-01T00:00:00Z" },
        ],
        lastMessage: {
            id: "104",
            conversationId: "4",
            senderId: "5",
            content: "Cảm ơn bạn nhiều! 🎉",
            type: "TEXT",
            isRead: true,
            createdAt: "2026-02-04T18:30:00Z",
        },
        unreadCount: 0,
    },
];

const mockMessages: Record<string, Message[]> = {
    "1": [
        { id: "1", conversationId: "1", senderId: "2", content: "Hey! Bạn khỏe không?", type: "TEXT", isRead: true, createdAt: "2026-02-05T07:00:00Z" },
        { id: "2", conversationId: "1", senderId: "1", content: "Mình khỏe! Cảm ơn bạn", type: "TEXT", isRead: true, createdAt: "2026-02-05T07:05:00Z" },
        { id: "3", conversationId: "1", senderId: "1", content: "Còn bạn thì sao?", type: "TEXT", isRead: true, createdAt: "2026-02-05T07:06:00Z" },
        { id: "4", conversationId: "1", senderId: "2", content: "Mình cũng ổn!", type: "TEXT", isRead: true, createdAt: "2026-02-05T07:15:00Z" },
        { id: "5", conversationId: "1", senderId: "2", content: "Chào bạn! Hôm nay thế nào?", type: "TEXT", isRead: false, createdAt: "2026-02-05T07:30:00Z" },
    ],
    "2": [
        { id: "10", conversationId: "2", senderId: "3", content: "Bạn có file thiết kế chưa?", type: "TEXT", isRead: true, createdAt: "2026-02-05T06:00:00Z" },
        { id: "11", conversationId: "2", senderId: "1", content: "Có rồi, để mình gửi", type: "TEXT", isRead: true, createdAt: "2026-02-05T06:10:00Z" },
        { id: "12", conversationId: "2", senderId: "1", content: "Đã gửi file cho bạn rồi nhé!", type: "TEXT", isRead: true, createdAt: "2026-02-05T06:15:00Z" },
    ],
    "3": [
        { id: "20", conversationId: "3", senderId: "2", content: "Mọi người ơi, sprint mới bắt đầu rồi!", type: "TEXT", isRead: true, createdAt: "2026-02-04T20:00:00Z" },
        { id: "21", conversationId: "3", senderId: "3", content: "Ok, mình đã assign task rồi", type: "TEXT", isRead: true, createdAt: "2026-02-04T20:30:00Z" },
        { id: "22", conversationId: "3", senderId: "1", content: "Mình sẽ làm phần Message UI", type: "TEXT", isRead: true, createdAt: "2026-02-04T21:00:00Z" },
        { id: "23", conversationId: "3", senderId: "4", content: "Mọi người review PR giúp mình với!", type: "TEXT", isRead: true, createdAt: "2026-02-04T22:00:00Z" },
    ],
    "4": [
        { id: "30", conversationId: "4", senderId: "5", content: "Bạn giúp mình fix bug nhé", type: "TEXT", isRead: true, createdAt: "2026-02-04T17:00:00Z" },
        { id: "31", conversationId: "4", senderId: "1", content: "Được, mình xem thử", type: "TEXT", isRead: true, createdAt: "2026-02-04T17:30:00Z" },
        { id: "32", conversationId: "4", senderId: "1", content: "Fixed rồi nhé!", type: "TEXT", isRead: true, createdAt: "2026-02-04T18:00:00Z" },
        { id: "33", conversationId: "4", senderId: "5", content: "Cảm ơn bạn nhiều! 🎉", type: "TEXT", isRead: true, createdAt: "2026-02-04T18:30:00Z" },
    ],
};

const MessagesPage: React.FC = () => {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [conversations] = useState<Conversation[]>(mockConversations);
    const [messages, setMessages] = useState<Message[]>([]);

    useLayoutEffect(() => {
        setIsLayoutReady(true);
    }, []);

    const handleSelectConversation = useCallback((conversation: Conversation) => {
        setSelectedConversation(conversation);
        // Load messages for selected conversation
        setMessages(mockMessages[conversation.id] || []);
    }, []);

    const handleBackToList = useCallback(() => {
        setSelectedConversation(null);
        setMessages([]);
    }, []);

    const handleSendMessage = useCallback((content: string) => {
        if (!selectedConversation || !content.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            conversationId: selectedConversation.id,
            senderId: "1", // Current user
            content: content.trim(),
            type: "TEXT",
            isRead: false,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, newMessage]);
    }, [selectedConversation]);

    if (!isLayoutReady) {
        return <div className="messages-page" style={{ visibility: "hidden" }} />;
    }

    // Mobile layout: show either list or chat
    if (isMobile) {
        return (
            <div className="messages-page mobile">
                {!selectedConversation ? (
                    <ConversationList
                        conversations={conversations}
                        selectedId={null}
                        onSelect={handleSelectConversation}
                        currentUserId="1"
                    />
                ) : (
                    <ChatArea
                        conversation={selectedConversation}
                        messages={messages}
                        onBack={handleBackToList}
                        onSendMessage={handleSendMessage}
                        currentUserId="1"
                        isMobile={true}
                    />
                )}
            </div>
        );
    }

    // Desktop layout: side by side
    return (
        <div className="messages-page desktop">
            <div className="messages-sidebar">
                <ConversationList
                    conversations={conversations}
                    selectedId={selectedConversation?.id || null}
                    onSelect={handleSelectConversation}
                    currentUserId="1"
                />
            </div>
            <div className="messages-main">
                {selectedConversation ? (
                    <ChatArea
                        conversation={selectedConversation}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        currentUserId="1"
                        isMobile={false}
                    />
                ) : (
                    <div className="no-conversation-selected">
                        <div className="empty-state">
                            <div className="empty-icon">💬</div>
                            <h3>Chọn cuộc trò chuyện</h3>
                            <p>Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
