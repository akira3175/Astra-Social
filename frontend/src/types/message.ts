/**
 * Message Types
 * Types related to messaging feature
 * Based on database schema: conversations, conversation_members, messages
 */

/**
 * Conversation type enum
 */
export type ConversationType = 'PRIVATE' | 'GROUP';

/**
 * Message type enum
 */
export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'SYSTEM';

/**
 * Attachment type for messages
 */
export type AttachmentType = 'image' | 'video' | 'file';

/**
 * Message attachment interface
 */
export interface MessageAttachment {
    id: string;
    url: string;
    type: AttachmentType;
    name: string;
    size: number;
    mimeType?: string;
}

/**
 * Member role in conversation
 */
export type MemberRole = 'ADMIN' | 'MEMBER';

/**
 * Simplified user info for messages
 */
export interface MessageUser {
    id: string;
    username: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
}

/**
 * Conversation member
 */
export interface ConversationMember {
    userId: string;
    user: MessageUser;
    role: MemberRole;
    nickname?: string;
    joinedAt: string;
}

/**
 * Message interface
 */
export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    sender?: MessageUser;
    content: string | null;
    type: MessageType;
    attachments?: MessageAttachment[];
    isRead: boolean;
    createdAt: string;
}

/**
 * Conversation interface
 */
export interface Conversation {
    id: string;
    type: ConversationType;
    name?: string;
    imageUrl?: string;
    lastMessageAt?: string;
    lastMessage?: Message;
    members: ConversationMember[];
    unreadCount?: number;
}

/**
 * API Response types
 */
export interface ConversationListResponse {
    success: boolean;
    data: Conversation[];
    message?: string;
}

export interface MessageListResponse {
    success: boolean;
    data: Message[];
    message?: string;
}
