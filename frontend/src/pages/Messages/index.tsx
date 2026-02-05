import React, { useState, useCallback, useLayoutEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ConversationList from "./components/ConversationList";
import ChatArea from "./components/ChatArea";
import type { Conversation, Message, MessageUser, MessageAttachment, AttachmentType, MessageType } from "../../types/message";
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
        {
            id: "5",
            conversationId: "1",
            senderId: "2",
            content: "Xem ảnh này nè!",
            type: "IMAGE",
            attachments: [
                { id: "a1", url: "https://picsum.photos/seed/msg1/400/300", type: "image", name: "photo1.jpg", size: 125000 },
                { id: "a2", url: "https://picsum.photos/seed/msg2/400/300", type: "image", name: "photo2.jpg", size: 98000 },
            ],
            isRead: true,
            createdAt: "2026-02-05T07:20:00Z"
        },
        {
            id: "6",
            conversationId: "1",
            senderId: "2",
            content: null,
            type: "IMAGE",
            attachments: [
                { id: "a3", url: "https://picsum.photos/seed/msg3/400/300", type: "image", name: "screenshot.png", size: 256000 },
            ],
            isRead: true,
            createdAt: "2026-02-05T07:25:00Z"
        },
        { id: "7", conversationId: "1", senderId: "2", content: "Chào bạn! Hôm nay thế nào?", type: "TEXT", isRead: false, createdAt: "2026-02-05T07:30:00Z" },
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

    const handleSendMessage = useCallback((content: string, files?: File[]) => {
        if (!selectedConversation || (!content.trim() && (!files || files.length === 0))) return;

        // Create attachments from files
        const attachments: MessageAttachment[] = files?.slice(0, 4).map((file, index) => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            let attachmentType: AttachmentType = 'file';
            if (isImage) attachmentType = 'image';
            if (isVideo) attachmentType = 'video';

            return {
                id: `${Date.now()}-${index}`,
                url: URL.createObjectURL(file),
                type: attachmentType,
                name: file.name,
                size: file.size,
                mimeType: file.type,
            };
        }) || [];

        // Determine message type
        let messageType: MessageType = 'TEXT';
        if (attachments.length > 0) {
            const hasOnlyImages = attachments.every(a => a.type === 'image');
            const hasVideo = attachments.some(a => a.type === 'video');
            if (hasVideo) {
                messageType = 'VIDEO';
            } else if (hasOnlyImages) {
                messageType = 'IMAGE';
            } else {
                messageType = 'FILE';
            }
        }

        const newMessage: Message = {
            id: Date.now().toString(),
            conversationId: selectedConversation.id,
            senderId: "1", // Current user
            content: content.trim() || null,
            type: messageType,
            attachments: attachments.length > 0 ? attachments : undefined,
            isRead: false,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, newMessage]);
    }, [selectedConversation]);

    // Chat action handlers (placeholders - will integrate with backend later)
    const handleAddMember = useCallback(() => {
        console.log('Add member to group:', selectedConversation?.id);
        alert('Chức năng thêm thành viên sẽ được tích hợp sau!');
    }, [selectedConversation]);

    const handleRenameGroup = useCallback(() => {
        const newName = prompt('Nhập tên nhóm mới:', selectedConversation?.name || '');
        if (newName) {
            console.log('Rename group:', selectedConversation?.id, 'to', newName);
            alert(`Đổi tên nhóm thành: ${newName}`);
        }
    }, [selectedConversation]);

    const handleLeaveGroup = useCallback(() => {
        if (confirm('Bạn có chắc muốn rời khỏi nhóm này?')) {
            console.log('Leave group:', selectedConversation?.id);
            alert('Bạn đã rời khỏi nhóm!');
        }
    }, [selectedConversation]);

    const handleTransferAdmin = useCallback(() => {
        console.log('Transfer admin in group:', selectedConversation?.id);
        alert('Chức năng chuyển nhóm trưởng sẽ được tích hợp sau!');
    }, [selectedConversation]);

    const handleBlockUser = useCallback(() => {
        if (confirm('Bạn có chắc muốn chặn người dùng này?')) {
            console.log('Block user in conversation:', selectedConversation?.id);
            alert('Đã chặn người dùng!');
        }
    }, [selectedConversation]);

    const handleCreateGroup = useCallback(() => {
        console.log('Create group from conversation:', selectedConversation?.id);
        alert('Chức năng tạo nhóm chat sẽ được tích hợp sau!');
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
                        onCreateNewGroup={handleCreateGroup}
                    />
                ) : (
                    <ChatArea
                        conversation={selectedConversation}
                        messages={messages}
                        onBack={handleBackToList}
                        onSendMessage={handleSendMessage}
                        currentUserId="1"
                        isMobile={true}
                        onAddMember={handleAddMember}
                        onRenameGroup={handleRenameGroup}
                        onLeaveGroup={handleLeaveGroup}
                        onTransferAdmin={handleTransferAdmin}
                        onBlockUser={handleBlockUser}
                        onCreateGroup={handleCreateGroup}
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
                    onCreateNewGroup={handleCreateGroup}
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
                        onAddMember={handleAddMember}
                        onRenameGroup={handleRenameGroup}
                        onLeaveGroup={handleLeaveGroup}
                        onTransferAdmin={handleTransferAdmin}
                        onBlockUser={handleBlockUser}
                        onCreateGroup={handleCreateGroup}
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
