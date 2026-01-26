<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(
        private PostService $postService
    ) {}

    /**
     * Get paginated posts (newsfeed).
     */
    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $userId = $request->user()?->id;

        $result = $this->postService->getPosts($page, $perPage, $userId);

        return response()->json([
            'success' => true,
            'data' => $result['posts'],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Get single post by ID.
     */
    public function show(int $id): JsonResponse
    {
        $result = $this->postService->getPostById($id);

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
     * Get posts by user ID.
     */
    public function byUser(int $userId, Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);

        $result = $this->postService->getPostsByUserId($userId, $page, $perPage);

        return response()->json([
            'success' => true,
            'data' => $result['posts'],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Create a new post.
     */
    public function store(CreatePostRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $result = $this->postService->createPost($user, $data);

        return response()->json([
            'success' => true,
            'data' => $result['data'],
        ], 201);
    }

    /**
     * Update a post.
     */
    public function update(UpdatePostRequest $request, int $id): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        $result = $this->postService->updatePost($id, $user->id, $data);

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
     * Delete a post.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $result = $this->postService->deletePost($id, $user->id);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['code']);
        }

        return response()->json([
            'success' => true,
            'message' => $result['message'],
        ]);
    }
}
