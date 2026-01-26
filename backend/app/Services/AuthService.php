<?php

namespace App\Services;

use App\Models\AuthToken;
use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Hash;
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
     * Register a new user.
     *
     * @return array{success: bool, data?: array, message?: string, code?: int}
     */
    public function register(string $username, string $email, string $password): array
    {
        // Get default User role (id = 4 based on seeder order)
        $userRole = \App\Models\Role::where('name', 'User')->first();

        // Create new user
        $user = User::create([
            'username' => $username,
            'email' => $email,
            'password' => $password, // Will be hashed automatically
            'role_id' => $userRole?->id,
            'is_active' => true,
            'is_verified' => false,
        ]);

        // Generate tokens
        $tokens = $this->generateTokens($user);

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
}
