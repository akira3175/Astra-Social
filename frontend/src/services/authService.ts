import { api, apiNoAuth } from "../configs/api";
import { tokenService } from "./tokenService";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    RefreshResponse,
    SendRegisterOtpRequest,
    SendOtpResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
} from "../types/auth";

/**
 * Auth Service
 * Handles authentication API calls: login, register, refresh, logout
 */

// ============ Endpoints ============

const ENDPOINTS = {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    SEND_REGISTER_OTP: "/auth/send-register-otp",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
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
 * Send OTP for registration
 */
export const sendRegisterOtp = async (userData: SendRegisterOtpRequest): Promise<SendOtpResponse> => {
    const response = await apiNoAuth.post<SendOtpResponse>(
        ENDPOINTS.SEND_REGISTER_OTP,
        userData
    );

    return response.data;
};

/**
 * Register new user with OTP verification
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
export const logout = (): void => {
    const refreshTokenValue = tokenService.getRefreshToken();

    // Fire the API call in the background without blocking
    if (refreshTokenValue) {
        api.post(ENDPOINTS.LOGOUT, {
            refresh_token: refreshTokenValue,
        }).catch((error) => {
            console.error("Logout API error:", error);
        });
    }

    // Immediately clear tokens and redirect to login
    tokenService.clear();
    window.location.href = "/login";
};

/**
 * Check if user is authenticated (has valid tokens)
 */
export const isAuthenticated = (): boolean => {
    return tokenService.hasTokens();
};

/**
 * Send password reset link to email
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const response = await apiNoAuth.post<ForgotPasswordResponse>(
        ENDPOINTS.FORGOT_PASSWORD,
        data
    );

    return response.data;
};

/**
 * Reset password using token
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await apiNoAuth.post<ResetPasswordResponse>(
        ENDPOINTS.RESET_PASSWORD,
        data
    );

    return response.data;
};

/**
 * Change password for authenticated user
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    const response = await api.post<ChangePasswordResponse>(
        ENDPOINTS.CHANGE_PASSWORD,
        data
    );

    return response.data;
};
