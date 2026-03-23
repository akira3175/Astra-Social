import { api } from "../configs/api";
import type { 
    Conversation, 
    ConversationsResponse, 
    MessagesResponse, 
    SendMessageResponse 
} from "../types/chat";

const ENDPOINTS = {
    CONVERSATIONS: "/conversations",
    CHAT: "/chat", 
};

export const getConversations = async (): Promise<ConversationsResponse> => {
    const response = await api.get<ConversationsResponse>(ENDPOINTS.CONVERSATIONS);
    return response.data;
};

export const getMessages = async (conversationId: number): Promise<MessagesResponse> => {
    const response = await api.get<MessagesResponse>(`${ENDPOINTS.CONVERSATIONS}/${conversationId}/messages`);
    return response.data;
};

export const sendGroupMessage = async (
    conversationId: number, 
    content: string
): Promise<SendMessageResponse> => {
    const response = await api.post<SendMessageResponse>(
        `${ENDPOINTS.CHAT}/group/${conversationId}/send`, 
        { content }
    );
    return response.data;
};

export const sendPrivateMessage = async (
    receiverId: number, 
    content: string
): Promise<SendMessageResponse> => {
    const response = await api.post<SendMessageResponse>(`${ENDPOINTS.CHAT}/private`, {
        receiver_id: receiverId,
        content: content,
    });
    return response.data;
};

export const renameGroup = async (
    conversationId: number, 
    name: string
): Promise<{ success: boolean }> => {
    const response = await api.put(`${ENDPOINTS.CHAT}/group/${conversationId}/rename`, { name });
    return response.data;
};

export const leaveGroup = async (conversationId: number): Promise<{ success: boolean }> => {
    const response = await api.delete(`${ENDPOINTS.CHAT}/group/${conversationId}/leave`);
    return response.data;
};

export const createGroup = async (
    name: string, 
    memberIds: number[]
): Promise<{ success: boolean; data: any }> => {
    const response = await api.post(`${ENDPOINTS.CHAT}/group`, { 
        name: name,
        member_ids: memberIds 
    });
    return response.data;
};

export const addAdmin = async (
    conversationId: number, 
    userId: number
): Promise<{ success: boolean }> => {
    const response = await api.post(`${ENDPOINTS.CHAT}/group/${conversationId}/add-admin`, { 
        user_id: userId 
    });
    return response.data;
};

export const removeMember = async (
    conversationId: number, 
    targetId: number
): Promise<{ success: boolean }> => {
    const response = await api.delete(`${ENDPOINTS.CHAT}/group/${conversationId}/remove-member/${targetId}`);
    return response.data;
};