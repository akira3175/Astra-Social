import { api } from "../configs/api";

export interface AiTextResponse {
    success: boolean;
    data: { text: string };
    message?: string;
}

/**
 * Improve the quality of existing post text using Gemini AI (via backend).
 */
export const improvePostText = async (text: string): Promise<string> => {
    const response = await api.post<AiTextResponse>('/ai/improve-text', { text });
    if (!response.data.success) throw new Error(response.data.message ?? 'AI error');
    return response.data.data.text;
};

/**
 * Generate a post caption from an array of image Files using Gemini AI (via backend).
 */
export const generateCaptionFromImages = async (files: File[]): Promise<string> => {
    // Convert Files to base64
    const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // Strip the "data:image/...;base64," prefix
                resolve(result.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const base64Images = await Promise.all(files.map(toBase64));
    const mimeTypes = files.map(f => f.type || 'image/jpeg');

    const response = await api.post<AiTextResponse>('/ai/generate-caption', {
        images:     base64Images,
        mime_types: mimeTypes,
    });

    if (!response.data.success) throw new Error(response.data.message ?? 'AI error');
    return response.data.data.text;
};
