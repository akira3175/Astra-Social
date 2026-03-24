<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateCommentRequest;
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
        $page    = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $userId  = $request->user()?->id;

        $result = $this->postService->getPosts($page, $perPage, $userId);

        return response()->json([
            'success'    => true,
            'data'       => $result['posts'],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Get ranked News Feed for authenticated user.
     */
    public function newsfeed(Request $request): JsonResponse
    {
        $user = $request->user();
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);

        $result = $this->postService->getNewsFeed($user->id, $page, $perPage);

        return response()->json([
            'success' => true,
            'data' => $result['posts'],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Get single post by ID.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $result = $this->postService->getPostById($id, $request->user()?->id);

        if (!$result['success']) {
            return response()->json(['success' => false, 'message' => $result['message']], 404);
        }

        return response()->json(['success' => true, 'data' => $result['data']]);
    }

    /**
     * Get posts by user ID.
     */
    public function byUser(int $userId, Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);
        $currentUserId = $request->user()?->id;

        $result = $this->postService->getPostsByUserId($userId, $page, $perPage, $currentUserId);

        return response()->json([
            'success'    => true,
            'data'       => $result['posts'],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Get posts for the currently logged-in user.
     */
    public function myPosts(Request $request): JsonResponse
    {
        $user = $request->user();
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);

        $result = $this->postService->getMyPosts($user->id, $page, $perPage);

        return response()->json([
            'success'    => true,
            'data'       => $result['posts'],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Create a new post with optional file attachments.
     */
    public function store(CreatePostRequest $request): JsonResponse
    {
        $result = $this->postService->createPost(
            $request->user(),
            $request->validated(),
            $request->file('files', [])
        );

        if (!$result['success']) {
            return response()->json(['success' => false, 'message' => $result['message']], $result['code']);
        }

        return response()->json(['success' => true, 'data' => $result['data']], 201);
    }

    /**
     * Update a post (content and privacy only).
     */
    public function update(UpdatePostRequest $request, int $id): JsonResponse
    {
        $result = $this->postService->updatePost($id, $request->user()->id, $request->validated());

        if (!$result['success']) {
            return response()->json(['success' => false, 'message' => $result['message']], $result['code']);
        }

        return response()->json(['success' => true, 'data' => $result['data']]);
    }

    /**
     * Delete a post and its attachments.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $result = $this->postService->deletePost($id, $request->user()->id);

        if (!$result['success']) {
            return response()->json(['success' => false, 'message' => $result['message']], $result['code']);
        }

        return response()->json(['success' => true, 'message' => $result['message']]);
    }

    /**
     * Get posts by hashtag.
     */
    public function hashtagPosts(string $hashtagName, Request $request): JsonResponse
    {
        $result = $this->postService->getPostsByHashtag(
            $hashtagName,
            (int) $request->query('page', 1),
            (int) $request->query('per_page', 10)
        );

        if (!$result['success']) {
            return response()->json(['success' => false, 'message' => $result['message']], 404);
        }

        return response()->json([
            'success'    => true,
            'data'       => $result['posts'],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Search hashtag (autocomplete).
     */
    public function searchHashtag(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $this->postService->searchHashtags($request->query('q')),
        ]);
    }

    /**
     * Trending hashtags (Redis).
     */
    public function trendingHashtags(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $this->postService->getTrendingHashtags(),
        ]);
    }

    /**
     * Tìm kiếm tổng hợp: users + posts (content + hashtag).
     * GET /search?q=keyword&page=1&per_page=10
     */
    public function search(Request $request): JsonResponse
    {
        $keyword = trim($request->query('q', ''));
        $page    = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);

        if ($keyword === '') {
            return response()->json([
                'success' => false,
                'message' => 'Keyword is required',
            ], 422);
        }

        $result = $this->postService->search($keyword, $page, $perPage);

        return response()->json([
            'success'    => true,
            'data'       => [
                'users' => $result['users'],
                'posts' => $result['posts'],
            ],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Toggle like on a post.
     */
    public function like(Request $request, int $postId): JsonResponse
    {
        $result = $this->postService->toggleLike($postId, $request->user()->id);

        if (isset($result['success']) && !$result['success']) {
            return response()->json(['success' => false, 'message' => $result['message']], $result['code'] ?? 404);
        }

        return response()->json(['success' => true, 'data' => $result]);
    }

    /**
     * Create a comment on a post.
     */
    public function comment(CreateCommentRequest $request, int $id): JsonResponse
    {
        $result = $this->postService->createComment($id, $request->user()->id, $request->validated());

        if (!$result['success']) {
            return response()->json(['success' => false, 'message' => $result['message']], $result['code']);
        }

        return response()->json(['success' => true, 'data' => $result['data']], 201);
    }

    /**
     * Get comments for a post (paginated).
     */
    public function getComments(int $id, Request $request): JsonResponse
    {
        $result = $this->postService->getComments(
            $id,
            (int) $request->query('page', 1),
            (int) $request->query('per_page', 10)
        );

        if (!$result['success']) {
            return response()->json(['success' => false, 'message' => $result['message']], $result['code'] ?? 404);
        }

        return response()->json([
            'success'    => true,
            'data'       => $result['comments'],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Share a post — tạo post mới embed bài gốc, caption tùy chọn.
     * POST /posts/{id}/share   body: { caption?: string }
     */
    public function share(Request $request, int $id): JsonResponse
    {
        $caption = $request->input('caption');   // nullable

        $result = $this->postService->sharePost($id, $request->user()->id, $caption);

        if (!$result['success']) {
            return response()->json(['success' => false, 'message' => $result['message']], $result['code'] ?? 404);
        }

        return response()->json(['success' => true, 'data' => $result['data']], 201);
    }

    /**
     * Toggle like on a comment.
     */
    public function likeComment(Request $request, int $commentId): JsonResponse
    {
        $result = $this->postService->toggleCommentLike($commentId, $request->user()->id);

        if (isset($result['success']) && !$result['success']) {
            return response()->json(['success' => false, 'message' => $result['message']], $result['code'] ?? 404);
        }

        return response()->json(['success' => true, 'data' => $result]);
    }

    // Admin 

    public function adminIndex(Request $request): JsonResponse
    {
        $posts = $this->postService->getAdminPost($request->all());

        if ($posts) {
            return response()->json(['success' => true, 'data' => $posts]);
        }

        return response()->json(['success' => false, 'message' => 'Không có bài viết nào']);
    }

    public function restorePostById(string $id): JsonResponse
    {
        $result = $this->postService->restorePostById($id);

        if ($result) {
            return response()->json(['success' => true, 'data' => $result, 'message' => 'Khôi phục bài viết thành công']);
        }

        return response()->json(['success' => false, 'message' => 'Không có bài viết nào']);
    }

    public function adminDestroy(Request $request, string $id): JsonResponse
    {
        $post = $this->postService->adminDeletePostById($request->all()['auth_user'], $id);

        if ($post) {
            return response()->json(['success' => true, 'message' => 'Xóa bài viết thành công']);
        }

        return response()->json(['success' => false, 'message' => 'Xóa bài viết thất bại']);
    }

    public function adminGetCountByDays(int $days): JsonResponse
    {
        return response()->json(['data' => $this->postService->adminGetCountByDays($days)]);
    }
}