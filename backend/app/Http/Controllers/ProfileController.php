<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use App\Services\ProfileService;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        private ProfileService $profileService,
        private AuthService $authService
    ) {}

    /**
     * Get the authenticated user's profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $this->profileService->getUserProfile($user);

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Get user profile by ID (public).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        // Resolve authenticated user if a valid JWT token is present (optional auth)
        $authUser = null;
        $header = $request->header('Authorization');
        if ($header && str_starts_with($header, 'Bearer ')) {
            $token = substr($header, 7);
            $authUser = $this->authService->getUserFromToken($token);
        }

        // Mutual block check: if either party has blocked the other, deny access
        if ($authUser && $authUser->id !== $id) {
            if ($authUser->hasBlockedUser($id) || $authUser->isBlockedBy($id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xem hồ sơ này.',
                    'reason'  => 'blocked',
                ], 403);
            }
        }

        $result = $this->profileService->getProfileById($id);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $result['data'],
        ]);
    }

    /**
     * Update authenticated user's profile.
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $result = $this->profileService->updateProfile($user->id, $data);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data'],
        ]);
    }

    /**
     * Upload and update avatar.
     */
    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:5120'], // Max 5MB
        ]);

        $user = $request->user();
        $file = $request->file('avatar');

        $result = $this->profileService->uploadAvatar($user->id, $file);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data'],
        ]);
    }

    /**
     * Upload and update cover image.
     */
    public function uploadCover(Request $request): JsonResponse
    {
        $request->validate([
            'cover' => ['required', 'image', 'max:10240'], // Max 10MB
            'position' => ['sometimes', 'integer', 'min:0', 'max:100'],
        ]);

        $user = $request->user();
        $file = $request->file('cover');
        $position = $request->input('position');

        $result = $this->profileService->uploadCover($user->id, $file, $position);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data'],
        ]);
    }
}

