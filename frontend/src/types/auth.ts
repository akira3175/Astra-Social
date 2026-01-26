/**
 * Auth Types
 */

// ============ Request Types ============

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
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
