import { User } from "./user";

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    type?: 'TEXT' | 'SYSTEM' | 'IMAGE'; // Cột type trong database của bạn
    is_read?: boolean;
    created_at: string;
    sender?: User; // Để hiển thị tên/avatar người gửi
}

export interface ConversationMember {
    conversation_id: number;
    user_id: number;
    role: 'ADMIN' | 'MEMBER';
    user?: User;
}

export interface Conversation {
    id: number;
    name: string | null;
    type: 'PRIVATE' | 'GROUP';
    image_url?: string;
    last_message_at: string;
    members?: ConversationMember[];
    messages?: Message[]; // Thường chứa tin nhắn cuối cùng để hiện preview
}

// Định nghĩa các kiểu Response trả về từ API
export interface ConversationsResponse {
    success: boolean;
    data: Conversation[];
}

export interface MessagesResponse {
    success: boolean;
    data: Message[];
}

export interface SendMessageResponse {
    success: boolean;
    message: string;
    data: Message;
}