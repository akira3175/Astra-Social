import { api, apiNoAuth } from "../configs/api";
import { tokenService } from "./tokenService";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    RefreshResponse,
} from "../types/auth";

/**
 * Auth Service
 * Handles authentication API calls: login, register, refresh, logout
 */

// ============ Endpoints ============

const ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
} as const;

// ============ API Functions ============

/**
 * Login user with email and password
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiNoAuth.post<LoginResponse>(
        ENDPOINTS.LOGIN,
        credentials
    );

    const { data } = response;

    if (data.success && data.data) {
        // Save tokens to localStorage
        tokenService.setTokens({
            accessToken: data.data.access_token,
            refreshToken: data.data.refresh_token,
            tokenType: data.data.token_type,
            expiresIn: data.data.expires_in,
        });
    }

    return data;
};

/**
 * Register new user
 */
export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiNoAuth.post<RegisterResponse>(
        ENDPOINTS.REGISTER,
        userData
    );

    const { data } = response;

    if (data.success && data.data?.tokens) {
        // Save tokens to localStorage
        tokenService.setTokens({
            accessToken: data.data.tokens.access_token,
            refreshToken: data.data.tokens.refresh_token,
            tokenType: data.data.tokens.token_type,
            expiresIn: data.data.tokens.expires_in,
        });
    }

    return data;
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (): Promise<string> => {
    const currentRefreshToken = tokenService.getRefreshToken();

    if (!currentRefreshToken) {
        throw new Error("No refresh token available");
    }

    const response = await apiNoAuth.post<RefreshResponse>(
        ENDPOINTS.REFRESH,
        { refresh_token: currentRefreshToken }
    );

    const { data } = response;

    if (data.success && data.data?.access_token) {
        // Update access token in localStorage
        tokenService.setAccessToken(data.data.access_token);

        return data.data.access_token;
    }

    throw new Error("Failed to refresh token");
};

/**
 * Logout user and clear tokens
 */
export const logout = async (): Promise<void> => {
    try {
        const refreshTokenValue = tokenService.getRefreshToken();

        if (refreshTokenValue) {
            await api.post(ENDPOINTS.LOGOUT, {
                refresh_token: refreshTokenValue,
            });
        }
    } catch (error) {
        // Ignore errors during logout, still clear tokens
        console.error("Logout API error:", error);
    } finally {
        // Clear tokens
        tokenService.clear();
    }
};

/**
 * Check if user is authenticated (has valid tokens)
 */
export const isAuthenticated = (): boolean => {
    return tokenService.hasTokens();
};
