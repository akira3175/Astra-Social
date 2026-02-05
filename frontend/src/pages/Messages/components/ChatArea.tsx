import React, { useState, useRef, useEffect, useCallback } from "react";
import { SendIcon, ImageIcon, MoreVertIcon, PersonAddIcon, EditIcon, ExitIcon, CrownIcon, BlockIcon, PlusIcon } from "../../../components/ui";
import type { Conversation, Message, MessageAttachment } from "../../../types/message";

interface FilePreview {
    file: File;
    preview: string;
    type: 'image' | 'video' | 'file';
}

interface ChatAreaProps {
    conversation: Conversation;
    messages: Message[];
    onBack?: () => void;
    onSendMessage: (content: string, files?: File[]) => void;
    currentUserId: string;
    isMobile: boolean;
    // Chat actions
    onAddMember?: () => void;
    onRenameGroup?: () => void;
    onLeaveGroup?: () => void;
    onTransferAdmin?: () => void;
    onBlockUser?: () => void;
    onCreateGroup?: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
    conversation,
    messages,
    onBack,
    onSendMessage,
    currentUserId,
    isMobile,
    onAddMember,
    onRenameGroup,
    onLeaveGroup,
    onTransferAdmin,
    onBlockUser,
    onCreateGroup,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
    const [showMenu, setShowMenu] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Get display name for conversation
    const getDisplayName = (): string => {
        if (conversation.type === "GROUP" && conversation.name) {
            return conversation.name;
        }
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
    const getAvatarInitial = (): string => {
        const name = getDisplayName();
        return name.charAt(0).toUpperCase();
    };

    // Get avatar URL
    const getAvatarUrl = (): string | undefined => {
        if (conversation.type === "GROUP") {
            return conversation.imageUrl;
        }
        const otherMember = conversation.members.find(m => m.userId !== currentUserId);
        return otherMember?.user?.avatar;
    };

    // Format message time
    const formatMessageTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Cleanup file previews on unmount
    useEffect(() => {
        return () => {
            selectedFiles.forEach(f => {
                if (f.type === 'image') {
                    URL.revokeObjectURL(f.preview);
                }
            });
        };
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    // Check if current user is admin
    const isAdmin = conversation.members.find(m => m.userId === currentUserId)?.role === 'ADMIN';
    const isGroup = conversation.type === 'GROUP';

    // Auto-resize textarea
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);

        // Auto resize
        if (textareaRef.current) {
            textareaRef.current.style.height = "24px";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, []);

    // Handle file selection
    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newFiles: FilePreview[] = [];
        Array.from(files).forEach(file => {
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            const preview = (isImage || isVideo) ? URL.createObjectURL(file) : '';
            let fileType: 'image' | 'video' | 'file' = 'file';
            if (isImage) fileType = 'image';
            if (isVideo) fileType = 'video';

            newFiles.push({
                file,
                preview,
                type: fileType
            });
        });

        setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 4)); // Max 4 files

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    // Remove selected file
    const handleRemoveFile = useCallback((index: number) => {
        setSelectedFiles(prev => {
            const file = prev[index];
            if (file.type === 'image') {
                URL.revokeObjectURL(file.preview);
            }
            return prev.filter((_, i) => i !== index);
        });
    }, []);

    // Handle send
    const handleSend = useCallback(() => {
        if (!inputValue.trim() && selectedFiles.length === 0) return;

        const files = selectedFiles.map(f => f.file);
        onSendMessage(inputValue, files.length > 0 ? files : undefined);
        setInputValue("");
        setSelectedFiles([]);

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = "24px";
        }
    }, [inputValue, selectedFiles, onSendMessage]);

    // Handle Enter key
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    // Open file picker
    const handleAttachClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const avatarUrl = getAvatarUrl();
    const memberCount = conversation.members.length;
    const canSend = inputValue.trim() || selectedFiles.length > 0;

    return (
        <div className={`chat-area ${isMobile ? "mobile" : ""}`}>
            {/* Header */}
            <div className="chat-header">
                {isMobile && onBack && (
                    <button className="back-button" onClick={onBack}>
                        ←
                    </button>
                )}
                <div className="chat-user-info">
                    <div className={`chat-avatar ${conversation.type === "GROUP" ? "group-avatar" : ""}`}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="" />
                        ) : (
                            getAvatarInitial()
                        )}
                    </div>
                    <div className="chat-user-details">
                        <h3>{getDisplayName()}</h3>
                        <span>
                            {conversation.type === "GROUP"
                                ? `${memberCount} thành viên`
                                : "Đang hoạt động"}
                        </span>
                    </div>
                </div>

                {/* Dropdown Menu */}
                <div className="chat-menu-wrapper" ref={menuRef}>
                    <button
                        className="chat-menu-button"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <MoreVertIcon size={22} />
                    </button>

                    {showMenu && (
                        <div className="chat-dropdown-menu">
                            {isGroup ? (
                                <>
                                    {isAdmin && onAddMember && (
                                        <button className="dropdown-item" onClick={() => { onAddMember(); setShowMenu(false); }}>
                                            <PersonAddIcon size={18} />
                                            <span>Thêm thành viên</span>
                                        </button>
                                    )}
                                    {isAdmin && onRenameGroup && (
                                        <button className="dropdown-item" onClick={() => { onRenameGroup(); setShowMenu(false); }}>
                                            <EditIcon size={18} />
                                            <span>Đổi tên nhóm</span>
                                        </button>
                                    )}
                                    {isAdmin && onTransferAdmin && (
                                        <button className="dropdown-item" onClick={() => { onTransferAdmin(); setShowMenu(false); }}>
                                            <CrownIcon size={18} />
                                            <span>Chuyển nhóm trưởng</span>
                                        </button>
                                    )}
                                    {onLeaveGroup && (
                                        <button className="dropdown-item danger" onClick={() => { onLeaveGroup(); setShowMenu(false); }}>
                                            <ExitIcon size={18} />
                                            <span>Rời nhóm</span>
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {onCreateGroup && (
                                        <button className="dropdown-item" onClick={() => { onCreateGroup(); setShowMenu(false); }}>
                                            <PlusIcon size={18} />
                                            <span>Tạo nhóm chat</span>
                                        </button>
                                    )}
                                    {onBlockUser && (
                                        <button className="dropdown-item danger" onClick={() => { onBlockUser(); setShowMenu(false); }}>
                                            <BlockIcon size={18} />
                                            <span>Chặn người dùng</span>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
                {messages.map((message) => {
                    const isSent = message.senderId === currentUserId;
                    const hasAttachments = message.attachments && message.attachments.length > 0;

                    // Get sender info for received messages
                    const sender = !isSent
                        ? conversation.members.find(m => m.userId === message.senderId)?.user
                        : null;
                    const senderInitial = sender
                        ? (sender.firstName?.charAt(0) || sender.username.charAt(0)).toUpperCase()
                        : "?";

                    return (
                        <div
                            key={message.id}
                            className={`message-row ${isSent ? "sent" : "received"}`}
                        >
                            {/* Sender avatar for received messages */}
                            {!isSent && (
                                <div className="message-avatar">
                                    {sender?.avatar ? (
                                        <img src={sender.avatar} alt="" />
                                    ) : (
                                        senderInitial
                                    )}
                                </div>
                            )}
                            <div className={`message-bubble ${isSent ? "sent" : "received"}`}>
                                {/* Render attachments */}
                                {hasAttachments && (
                                    <div className="bubble-attachments">
                                        {message.attachments!.map((attachment) => (
                                            <div key={attachment.id} className={`attachment-item ${attachment.type}`}>
                                                {attachment.type === 'image' && (
                                                    <div className="bubble-image">
                                                        <img src={attachment.url} alt="" />
                                                    </div>
                                                )}
                                                {attachment.type === 'video' && (
                                                    <div className="bubble-video">
                                                        <video src={attachment.url} controls />
                                                    </div>
                                                )}
                                                {attachment.type === 'file' && (
                                                    <a href={attachment.url} download={attachment.name} className="bubble-file">
                                                        <span className="file-icon">📎</span>
                                                        <div className="file-details">
                                                            <span className="file-name">{attachment.name}</span>
                                                            <span className="file-size">{formatFileSize(attachment.size)}</span>
                                                        </div>
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Render text content */}
                                {message.content && (
                                    <div className="bubble-content">
                                        {message.content}
                                    </div>
                                )}
                                <span className="message-time">
                                    {formatMessageTime(message.createdAt)}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* File Preview */}
            {selectedFiles.length > 0 && (
                <div className="file-preview-container">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className={`file-preview-item ${file.type}`}>
                            {file.type === 'image' && (
                                <img src={file.preview} alt="" />
                            )}
                            {file.type === 'video' && (
                                <video src={file.preview} muted />
                            )}
                            {file.type === 'file' && (
                                <>
                                    <div className="file-icon">📎</div>
                                    <div className="file-info">
                                        <span className="file-name">{file.file.name}</span>
                                        <span className="file-size">{formatFileSize(file.file.size)}</span>
                                    </div>
                                </>
                            )}
                            <button
                                className="file-remove-btn"
                                onClick={() => handleRemoveFile(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="message-input-container">
                <div className="message-input-wrapper">
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />

                    {/* Attach button */}
                    <button
                        className="attach-button"
                        onClick={handleAttachClick}
                        title="Đính kèm file"
                    >
                        <ImageIcon size={22} />
                    </button>

                    <textarea
                        ref={textareaRef}
                        className="message-input"
                        placeholder="Nhập tin nhắn..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                    <button
                        className="send-button"
                        onClick={handleSend}
                        disabled={!canSend}
                    >
                        <SendIcon size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
