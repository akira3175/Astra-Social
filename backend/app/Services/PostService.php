<?php

namespace App\Services;

use App\Models\MediaAttachment;
use App\Models\Post;
use App\Models\User;

class PostService
{
    public function __construct(
        private MediaService $mediaService
    ) {}

    /**
     * Get paginated posts (newsfeed).
     */
    public function getPosts(int $page = 1, int $perPage = 10, ?int $userId = null): array
    {
        $query = Post::with([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'attachments:id,url,file_type,entity_type,entity_id',
        ])
            ->where('privacy', Post::PRIVACY_PUBLIC)
            ->orderBy('created_at', 'desc');

        if ($userId) {
            $query->orWhere(function ($q) use ($userId) {
                $q->where('user_id', $userId);
            });
        }

        $posts = $query->paginate($perPage, ['*'], 'page', $page);

        return [
            'posts' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ];
    }

    /**
     * Get single post by ID.
     */
    public function getPostById(int $id): array
    {
        $post = Post::with([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'attachments:id,url,file_type,entity_type,entity_id',
        ])->find($id);

        if (!$post) {
            return [
                'success' => false,
                'message' => 'Post not found',
            ];
        }

        return [
            'success' => true,
            'data' => $post,
        ];
    }

    /**
     * Get posts by user ID.
     */
    public function getPostsByUserId(int $userId, int $page = 1, int $perPage = 10): array
    {
        $posts = Post::with([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'attachments:id,url,file_type,entity_type,entity_id',
        ])
            ->where('user_id', $userId)
            ->where('privacy', Post::PRIVACY_PUBLIC)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'posts' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ];
    }

    /**
     * Get all posts by the currently logged-in user.
     */
    public function getMyPosts(int $userId, int $page = 1, int $perPage = 999): array
    {
        $posts = Post::with([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'attachments:id,url,file_type,entity_type,entity_id',
        ])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'posts' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ];
    }

    /**
     * Create a new post with optional file attachments.
     */
    public function createPost(User $user, array $data, array $files = []): array
    {
        // If parent_id is provided, verify parent post exists
        if (!empty($data['parent_id'])) {
            $parentPost = Post::find($data['parent_id']);
            if (!$parentPost) {
                return [
                    'success' => false,
                    'message' => 'Parent post not found',
                    'code' => 404,
                ];
            }
        }

        // Validate max 4 files
        if (count($files) > 4) {
            return [
                'success' => false,
                'message' => 'Maximum 4 files allowed per post',
                'code' => 422,
            ];
        }

        $post = Post::create([
            'user_id' => $user->id,
            'parent_id' => $data['parent_id'] ?? null,
            'content' => $data['content'] ?? null,
            'privacy' => $data['privacy'] ?? Post::PRIVACY_PUBLIC,
        ]);

        // Upload files if provided
        if (!empty($files)) {
            $this->mediaService->uploadForEntity(
                $files,
                MediaAttachment::ENTITY_POST,
                $post->id,
                'posts/' . $user->id
            );
        }

        $post->load([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'attachments:id,url,file_type,entity_type,entity_id',
            'parent',
            'parent.user:id,username',
        ]);

        return [
            'success' => true,
            'data' => $post,
        ];
    }

    /**
     * Update a post (content and privacy only, no file changes).
     */
    public function updatePost(int $postId, int $userId, array $data): array
    {
        $post = Post::find($postId);

        if (!$post) {
            return [
                'success' => false,
                'message' => 'Post not found',
                'code' => 404,
            ];
        }

        if ($post->user_id !== $userId) {
            return [
                'success' => false,
                'message' => 'You can only update your own posts',
                'code' => 403,
            ];
        }

        // Only update content and privacy (no file changes allowed)
        $allowedFields = ['content', 'privacy'];
        $post->fill(array_intersect_key($data, array_flip($allowedFields)));
        $post->save();

        $post->load([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'attachments:id,url,file_type,entity_type,entity_id',
        ]);

        return [
            'success' => true,
            'data' => $post,
        ];
    }

    /**
     * Delete a post (soft delete) and its attachments.
     */
    public function deletePost(int $postId, int $userId): array
    {
        $post = Post::find($postId);

        if (!$post) {
            return [
                'success' => false,
                'message' => 'Post not found',
                'code' => 404,
            ];
        }

        if ($post->user_id !== $userId) {
            return [
                'success' => false,
                'message' => 'You can only delete your own posts',
                'code' => 403,
            ];
        }

        // Delete attachments from Cloudinary and database
        $this->mediaService->deleteForEntity(MediaAttachment::ENTITY_POST, $post->id);

        $post->delete();

        return [
            'success' => true,
            'message' => 'Post deleted successfully',
        ];
    }
}
