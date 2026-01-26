<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RefreshTokenRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthService $authService
    ) {}

    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $result = $this->authService->register(
            $data['username'],
            $data['email'],
            $data['password']
        );

        return response()->json([
            'success' => true,
            'data' => $result['data'],
        ], 201);
    }

    /**
     * Login and return access token + refresh token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $result = $this->authService->login(
            $credentials['email'],
            $credentials['password']
        );

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['code']);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data'],
        ]);
    }

    /**
     * Refresh access token using refresh token.
     */
    public function refresh(RefreshTokenRequest $request): JsonResponse
    {
        $refreshToken = $request->validated()['refresh_token'];

        $tokens = $this->authService->refreshAccessToken($refreshToken);

        if (!$tokens) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired refresh token',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => $tokens,
        ]);
    }

    /**
     * Logout - revoke refresh token.
     */
    public function logout(Request $request): JsonResponse
    {
        $refreshToken = $request->input('refresh_token');

        if ($refreshToken) {
            $this->authService->revokeRefreshToken($refreshToken);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }
}
