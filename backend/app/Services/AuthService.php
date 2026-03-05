<?php

namespace App\Services;

use App\Mail\OtpMail;
use App\Mail\ResetPasswordMail;
use App\Models\AuthToken;
use App\Models\Profile;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthService
{
    /**
     * Access token TTL in seconds (1 hour)
     */
    private const ACCESS_TOKEN_TTL = 3600;

    /**
     * Refresh token TTL in seconds (14 days)
     */
    private const REFRESH_TOKEN_TTL = 1209600;

    /**
     * OTP TTL in seconds (10 minutes)
     */
    private const OTP_TTL = 600;

    /**
     * Password reset token TTL in seconds (60 minutes)
     */
    private const PASSWORD_RESET_TTL = 3600;

    /**
     * Generate access token and refresh token for a user.
     */
    public function generateTokens(User $user): array
    {
        $accessToken = $this->generateAccessToken($user);
        $refreshToken = $this->generateRefreshToken($user);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => self::ACCESS_TOKEN_TTL,
        ];
    }

    /**
     * Authenticate user with email and password.
     *
     * @return array{success: bool, data?: array, message?: string, code?: int}
     */
    public function login(string $email, string $password): array
    {
        // Find user by email
        $user = User::where('email', $email)->first();

        // Validate credentials
        if (!$user || !Hash::check($password, $user->password)) {
            return [
                'success' => false,
                'message' => 'Invalid credentials',
                'code' => 401,
            ];
        }

        // Check if user is active
        if (!$user->is_active) {
            return [
                'success' => false,
                'message' => 'Account is not active',
                'code' => 403,
            ];
        }

        // Update last login
        $user->updateLastLogin();

        // Generate tokens
        $tokens = $this->generateTokens($user);

        return [
            'success' => true,
            'data' => $tokens,
        ];
    }

    /**
     * Send OTP email for registration.
     *
     * @return array{success: bool, message: string, code?: int}
     */
    public function sendRegisterOtp(
        string $username,
        string $email,
        string $password,
        array $profile
    ): array {
        // Generate 6-digit OTP
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Invalidate any existing OTPs for this email
        $cacheKey = 'register_otp_' . md5($email);
        Cache::forget($cacheKey);

        // Store registration data + OTP in cache for 10 minutes
        Cache::put($cacheKey, [
            'username' => $username,
            'email' => $email,
            'password' => $password,
            'profile' => $profile,
            'otp' => Hash::make($otp),
        ], self::OTP_TTL);

        // Send OTP email
        Mail::to($email)->send(new OtpMail($otp, $username));

        return [
            'success' => true,
            'message' => 'OTP sent successfully',
        ];
    }

    /**
     * Register a new user after OTP verification.
     *
     * @return array{success: bool, data?: array, message?: string, code?: int}
     */
    public function register(string $email, string $otp): array
    {
        // Retrieve cached registration data
        $cacheKey = 'register_otp_' . md5($email);
        $cachedData = Cache::get($cacheKey);

        if (!$cachedData) {
            return [
                'success' => false,
                'message' => 'OTP has expired or is invalid. Please request a new one.',
                'code' => 400,
            ];
        }

        // Verify OTP
        if (!Hash::check($otp, $cachedData['otp'])) {
            return [
                'success' => false,
                'message' => 'Invalid OTP code',
                'code' => 400,
            ];
        }

        // Get default User role
        $userRole = \App\Models\Role::where('name', 'User')->first();

        // Create new user
        $user = User::create([
            'username' => $cachedData['username'],
            'email' => $cachedData['email'],
            'password' => $cachedData['password'], // Will be hashed automatically
            'role_id' => $userRole?->id,
            'is_active' => true,
            'is_verified' => true,
        ]);

        // Create profile
        Profile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'first_name' => $cachedData['profile']['first_name'] ?? null,
                'last_name' => $cachedData['profile']['last_name'] ?? null,
                'birth_date' => $cachedData['profile']['birth_date'] ?? null,
            ]
        );

        // Generate tokens
        $tokens = $this->generateTokens($user);

        // Clean up cache
        Cache::forget($cacheKey);

        return [
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                ],
                'tokens' => $tokens,
            ],
        ];
    }

    /**
     * Generate JWT access token.
     */
    private function generateAccessToken(User $user): string
    {
        $issuedAt = time();
        $expiresAt = $issuedAt + self::ACCESS_TOKEN_TTL;

        $payload = [
            'iss' => config('app.url'),
            'sub' => $user->id,
            'iat' => $issuedAt,
            'exp' => $expiresAt,
            'username' => $user->username,
            'email' => $user->email,
            'role_id' => $user->role_id,
        ];

        return JWT::encode($payload, $this->getSecretKey(), 'HS256');
    }

    /**
     * Generate refresh token and store in database.
     */
    private function generateRefreshToken(User $user): string
    {
        $token = Str::random(64);
        $expiresAt = now()->addSeconds(self::REFRESH_TOKEN_TTL);

        // Revoke old refresh tokens for this user
        AuthToken::where('user_id', $user->id)
            ->where('type', AuthToken::TYPE_REFRESH)
            ->where('is_used', false)
            ->update(['is_used' => true]);

        // Create new refresh token
        AuthToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'type' => AuthToken::TYPE_REFRESH,
            'expires_at' => $expiresAt,
            'is_used' => false,
        ]);

        return $token;
    }

    /**
     * Validate refresh token and generate new access token.
     */
    public function refreshAccessToken(string $refreshToken): ?array
    {
        $hashedToken = hash('sha256', $refreshToken);

        $authToken = AuthToken::where('token', $hashedToken)
            ->where('type', AuthToken::TYPE_REFRESH)
            ->valid()
            ->first();

        if (!$authToken) {
            return null;
        }

        $user = $authToken->user;
        $accessToken = $this->generateAccessToken($user);

        return [
            'access_token' => $accessToken,
            'token_type' => 'bearer',
            'expires_in' => self::ACCESS_TOKEN_TTL,
        ];
    }

    /**
     * Revoke refresh token.
     */
    public function revokeRefreshToken(string $refreshToken): bool
    {
        $hashedToken = hash('sha256', $refreshToken);

        return AuthToken::where('token', $hashedToken)
            ->where('type', AuthToken::TYPE_REFRESH)
            ->update(['is_used' => true]) > 0;
    }

    /**
     * Parse and validate access token.
     */
    public function parseAccessToken(string $token): ?object
    {
        try {
            return JWT::decode($token, new Key($this->getSecretKey(), 'HS256'));
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get user from access token.
     */
    public function getUserFromToken(string $token): ?User
    {
        $payload = $this->parseAccessToken($token);

        if (!$payload) {
            return null;
        }

        return User::find($payload->sub);
    }

    /**
     * Get secret key for JWT.
     */
    private function getSecretKey(): string
    {
        return config('app.key');
    }

    /**
     * Send password reset link to email.
     *
     * @return array{success: bool, message: string, code?: int}
     */
    public function sendResetLink(string $email): array
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Email này chưa được đăng ký.',
                'code' => 404,
            ];
        }

        // Invalidate any existing password reset tokens for this user
        AuthToken::where('user_id', $user->id)
            ->where('type', AuthToken::TYPE_PASSWORD_RESET)
            ->where('is_used', false)
            ->update(['is_used' => true]);

        // Generate random token
        $token = Str::random(64);
        $expiresAt = now()->addSeconds(self::PASSWORD_RESET_TTL);

        // Store token in database
        AuthToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $token),
            'type' => AuthToken::TYPE_PASSWORD_RESET,
            'expires_at' => $expiresAt,
            'is_used' => false,
        ]);

        // Build reset link
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
        $resetLink = $frontendUrl . '/reset-password?token=' . $token . '&email=' . urlencode($email);

        // Send email
        Mail::to($email)->send(new ResetPasswordMail($resetLink, $email));

        return [
            'success' => true,
            'message' => 'Đã gửi link đặt lại mật khẩu đến email của bạn.',
        ];
    }

    /**
     * Reset user password using token.
     *
     * @return array{success: bool, message: string, code?: int}
     */
    public function resetPassword(string $email, string $token, string $password): array
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return [
                'success' => false,
                'message' => 'Email không hợp lệ.',
                'code' => 404,
            ];
        }

        // Find valid token
        $hashedToken = hash('sha256', $token);

        $authToken = AuthToken::where('user_id', $user->id)
            ->where('token', $hashedToken)
            ->where('type', AuthToken::TYPE_PASSWORD_RESET)
            ->valid()
            ->first();

        if (!$authToken) {
            return [
                'success' => false,
                'message' => 'Token không hợp lệ hoặc đã hết hạn.',
                'code' => 400,
            ];
        }

        // Update password
        $user->update([
            'password' => $password,
        ]);

        // Mark token as used
        $authToken->markAsUsed();

        // Invalidate all other password reset tokens for this user
        AuthToken::where('user_id', $user->id)
            ->where('type', AuthToken::TYPE_PASSWORD_RESET)
            ->where('id', '!=', $authToken->id)
            ->where('is_used', false)
            ->update(['is_used' => true]);

        return [
            'success' => true,
            'message' => 'Mật khẩu đã được đặt lại thành công.',
        ];
    }
}
