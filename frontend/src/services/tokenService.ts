/**
 * Token Service
 * Handles storage and retrieval of authentication tokens
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export interface TokenData {
    accessToken: string;
    refreshToken: string;
    tokenType?: string;
    expiresIn?: number;
}

export const tokenService = {
    /**
     * Get access token from localStorage
     */
    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    /**
     * Get refresh token from localStorage
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    /**
     * Save tokens to localStorage
     */
    setTokens(data: TokenData): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    },

    /**
     * Save only access token (used after refresh)
     */
    setAccessToken(token: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    /**
     * Clear all tokens from localStorage
     */
    clear(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    /**
     * Check if user has tokens stored
     */
    hasTokens(): boolean {
        return !!this.getAccessToken() && !!this.getRefreshToken();
    },
};
