<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class ProfileService
{
    public function __construct(
        private CloudinaryService $cloudinaryService
    ) {}

    /**
     * Get user profile data.
     *
     * @return array{user: array, profile: array}
     */
    public function getUserProfile(User $user): array
    {
        // Get or create profile for the user
        $profile = Profile::firstOrCreate(
            ['user_id' => $user->id],
            []
        );

        return [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role?->name,
                'is_active' => $user->is_active,
                'is_verified' => $user->is_verified,
                'last_login' => $user->last_login,
                'created_at' => $user->created_at,
            ],
            'profile' => [
                'first_name' => $profile->first_name,
                'last_name' => $profile->last_name,
                'bio' => $profile->bio,
                'avatar_url' => $profile->avatar_url,
                'cover_url' => $profile->cover_url,
                'cover_position' => $profile->cover_position,
                'phone' => $profile->phone,
                'address' => $profile->address,
                'birth_date' => $profile->birth_date?->format('Y-m-d'),
                'gender' => $profile->gender,
            ],
        ];
    }

    /**
     * Get public user profile data (hide sensitive info).
     *
     * @return array{user: array, profile: array}
     */
    public function getPublicProfile(User $user): array
    {
        // Get or create profile for the user
        $profile = Profile::firstOrCreate(
            ['user_id' => $user->id],
            []
        );

        return [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'is_verified' => $user->is_verified,
                'created_at' => $user->created_at,
            ],
            'profile' => [
                'first_name' => $profile->first_name,
                'last_name' => $profile->last_name,
                'bio' => $profile->bio,
                'avatar_url' => $profile->avatar_url,
                'cover_url' => $profile->cover_url,
                'cover_position' => $profile->cover_position,
                'gender' => $profile->gender,
            ],
        ];
    }

    /**
     * Get user profile by ID (public).
     *
     * @return array{success: bool, data?: array, message?: string}
     */
    public function getProfileById(int $id): array
    {
        $user = User::find($id);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found',
            ];
        }

        return [
            'success' => true,
            'data' => $this->getPublicProfile($user),
        ];
    }

    /**
     * Update user profile.
     *
     * @param int $userId
     * @param array $data
     * @return array{success: bool, data?: array, message?: string}
     */
    public function updateProfile(int $userId, array $data): array
    {
        $user = User::find($userId);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found',
            ];
        }

        // Get or create profile
        $profile = Profile::firstOrCreate(
            ['user_id' => $userId],
            []
        );

        // Update only provided fields
        $profile->fill($data);
        $profile->save();

        return [
            'success' => true,
            'data' => $this->getUserProfile($user),
        ];
    }

    /**
     * Upload and update avatar.
     *
     * @param int $userId
     * @param UploadedFile $file
     * @return array{success: bool, data?: array, message?: string}
     */
    public function uploadAvatar(int $userId, UploadedFile $file): array
    {
        $user = User::find($userId);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found',
            ];
        }

        // Upload to Cloudinary
        $result = $this->cloudinaryService->upload($file, 'avatars');

        if (!$result['success']) {
            return [
                'success' => false,
                'message' => $result['error'] ?? 'Failed to upload avatar',
            ];
        }

        // Update profile
        $profile = Profile::firstOrCreate(
            ['user_id' => $userId],
            []
        );

        $profile->avatar_url = $result['url'];
        $profile->save();

        return [
            'success' => true,
            'data' => $this->getUserProfile($user),
        ];
    }

    /**
     * Upload and update cover image.
     *
     * @param int $userId
     * @param UploadedFile $file
     * @param int|null $position Cover position (0-100)
     * @return array{success: bool, data?: array, message?: string}
     */
    public function uploadCover(int $userId, UploadedFile $file, ?int $position = null): array
    {
        $user = User::find($userId);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found',
            ];
        }

        // Upload to Cloudinary
        $result = $this->cloudinaryService->upload($file, 'covers');

        if (!$result['success']) {
            return [
                'success' => false,
                'message' => $result['error'] ?? 'Failed to upload cover',
            ];
        }

        // Update profile
        $profile = Profile::firstOrCreate(
            ['user_id' => $userId],
            []
        );

        $profile->cover_url = $result['url'];
        if ($position !== null) {
            $profile->cover_position = $position;
        }
        $profile->save();

        return [
            'success' => true,
            'data' => $this->getUserProfile($user),
        ];
    }
}

