import { api } from "../configs/api";
import type { 
    ConversationsResponse, 
    MessagesResponse, 
    SendMessageResponse 
} from "../types/chat";

const ENDPOINTS = {
    CONVERSATIONS: "/conversations",
    CHAT: "/chat", 
};

export const getOrCreateConversation = async (userId: number): Promise<{ success: boolean; data: any }> => {
    const response = await api.get(`${ENDPOINTS.CHAT}/conversation-with/${userId}`);
    return response.data;
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
    content: string,
    files?: File[]
): Promise<SendMessageResponse> => {
    if (files && files.length > 0) {
        const formData = new FormData();
        if (content) formData.append('content', content);
        files.forEach(f => formData.append('files[]', f));

        const response = await api.post<SendMessageResponse>(
            `${ENDPOINTS.CHAT}/group/${conversationId}/send`, 
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    }

    const response = await api.post<SendMessageResponse>(
        `${ENDPOINTS.CHAT}/group/${conversationId}/send`, 
        { content }
    );
    return response.data;
};

export const sendPrivateMessage = async (
    receiverId: number, 
    content: string,
    files?: File[]
): Promise<SendMessageResponse> => {
    if (files && files.length > 0) {
        const formData = new FormData();
        formData.append('receiver_id', String(receiverId));
        if (content) formData.append('content', content);
        files.forEach(f => formData.append('files[]', f));

        const response = await api.post<SendMessageResponse>(
            `${ENDPOINTS.CHAT}/private`, 
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        return response.data;
    }

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