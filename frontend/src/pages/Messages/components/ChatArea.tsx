import React, { useState, useRef, useEffect, useCallback } from "react";
import { SendIcon, ImageIcon, MoreVertIcon, PersonAddIcon, EditIcon, ExitIcon, CrownIcon, BlockIcon, PlusIcon } from "../../../components/ui";
import type { Conversation, Message } from "../../../types/message";

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
        
        // Find other member - handle both userId and user_id naming
        const otherMember = conversation.members.find((m: any) => 
            Number(m.userId || m.user_id) !== Number(currentUserId)
        );

        if (otherMember?.user) {
            const { firstName, lastName, username } = otherMember.user;
            if (firstName || lastName) {
                return `${lastName || ""} ${firstName || ""}`.trim();
            }
            return username;
        }
        return "Người dùng";
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
        const otherMember = conversation.members.find((m: any) => 
            Number(m.userId || m.user_id) !== Number(currentUserId)
        );
        return (otherMember?.user as any)?.avatar || (otherMember?.user as any)?.avatarUrl;
    };

    // Format message time
    const formatMessageTime = (dateString: string | undefined): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
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

    // Check if current conversation is a group
    const isGroup = conversation.type === 'GROUP';
    const isAdmin = isGroup && conversation.members.some((m: any) => 
        Number(m.userId || m.user_id) === Number(currentUserId) && m.role === 'ADMIN'
    );

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
                                    { onAddMember && (
                                        <button className="dropdown-item" onClick={() => { onAddMember(); setShowMenu(false); }}>
                                            <PersonAddIcon size={20} />
                                            <span>Thêm thành viên</span>
                                        </button>
                                    )}
                                    { onRenameGroup && (
                                        <button className="dropdown-item" onClick={() => { onRenameGroup(); setShowMenu(false); }}>
                                            <EditIcon size={20} />
                                            <span>Đổi tên nhóm</span>
                                        </button>
                                    )}
                                    {onTransferAdmin && isAdmin && (
                                        <button className="dropdown-item" onClick={() => { onTransferAdmin(); setShowMenu(false); }}>
                                            <CrownIcon size={20} />
                                            <span>Chuyển nhóm trưởng</span>
                                        </button>
                                    )}
                                    {onLeaveGroup && !isAdmin && (
                                        <button className="dropdown-item danger" onClick={() => { onLeaveGroup(); setShowMenu(false); }}>
                                            <ExitIcon size={20} />
                                            <span>Rời nhóm</span>
                                        </button>
                                    )}
                                    {onLeaveGroup && isAdmin && (
                                        <button className="dropdown-item danger" onClick={() => { alert("Bạn là nhóm trưởng, vui lòng chuyển quyền trước khi rời nhóm."); setShowMenu(false); }}>
                                            <ExitIcon size={20} />
                                            <span>Rời nhóm</span>
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {onCreateGroup && (
                                        <button className="dropdown-item" onClick={() => { onCreateGroup(); setShowMenu(false); }}>
                                            <PlusIcon size={20} />
                                            <span>Tạo nhóm chat</span>
                                        </button>
                                    )}
                                    {onBlockUser && (
                                        <button className="dropdown-item danger" onClick={() => { onBlockUser(); setShowMenu(false); }}>
                                            <BlockIcon size={20} />
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
                {messages.map((message: any) => {
                    const messageSenderId = Number(message.senderId || message.sender_id || 0);
                    const authUserId = Number(currentUserId);
                    const isSent = messageSenderId === authUserId;
                    
                    const hasAttachments = message.attachments && message.attachments.length > 0;
                    const msgCreatedAt = message.createdAt || message.created_at;

                    // Get sender info for received messages
                    const sender = !isSent
                        ? conversation.members.find((m: any) => Number(m.userId || m.user_id) === messageSenderId)?.user
                        : null;
                    const senderInitial = sender
                        ? (sender.firstName?.charAt(0) || sender.username?.charAt(0) || "?").toUpperCase()
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
                                        {message.attachments!.map((rawAttachment: any) => {
                                            const type = rawAttachment.type || (rawAttachment.file_type === 'IMAGE' ? 'image' : rawAttachment.file_type === 'VIDEO' ? 'video' : 'file');
                                            const name = rawAttachment.name || rawAttachment.original_name || `file-${rawAttachment.id}`;
                                            const size = rawAttachment.size || rawAttachment.file_size || 0;

                                            return (
                                                <div key={rawAttachment.id} className={`attachment-item ${type}`}>
                                                    {type === 'image' && (
                                                        <div className="bubble-image">
                                                            <img src={rawAttachment.url} alt="" />
                                                        </div>
                                                    )}
                                                    {type === 'video' && (
                                                        <div className="bubble-video">
                                                            <video src={rawAttachment.url} controls />
                                                        </div>
                                                    )}
                                                    {type === 'file' && (
                                                        <a href={rawAttachment.url} download={name} target="_blank" rel="noopener noreferrer" className="bubble-file">
                                                            <span className="file-icon">📎</span>
                                                            <div className="file-details">
                                                                <span className="file-name">{name}</span>
                                                                {size > 0 && <span className="file-size">{formatFileSize(size)}</span>}
                                                            </div>
                                                        </a>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {/* Render text content */}
                                {message.content && (
                                    <div className={`bubble-content ${isSent ? "sent" : "received"}`}>
                                        {message.content}
                                    </div>
                                )}
                                <span className={`message-time ${isSent ? "sent" : "received"}`}>
                                    {formatMessageTime(msgCreatedAt)}
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
