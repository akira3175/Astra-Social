/**
 * Auth Types
 */

// ============ Request Types ============

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SendRegisterOtpRequest {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
    birth_date: string;
}

export interface RegisterRequest {
    email: string;
    otp: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}

// ============ Response Types ============

export interface AuthTokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: AuthTokenResponse;
}

export interface SendOtpResponse {
    success: boolean;
    message: string;
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: number;
            username: string;
            email: string;
        };
        tokens: AuthTokenResponse;
    };
}

export interface RefreshResponse {
    success: boolean;
    message: string;
    data: {
        access_token: string;
        token_type: string;
        expires_in: number;
    };
}

export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
}
