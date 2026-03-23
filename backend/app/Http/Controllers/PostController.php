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
        $userId = $request->user()?->id;

        $result = $this->postService->getPostById($id, $userId);

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
        $currentUserId = $request->user()?->id;

        $result = $this->postService->getPostsByUserId($userId, $page, $perPage, $currentUserId);

        return response()->json([
            'success' => true,
            'data' => $result['posts'],
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
            'success' => true,
            'data' => $result['posts'],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Create a new post with optional file attachments.
     */
    public function store(CreatePostRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();
        $files = $request->file('files', []);

        $result = $this->postService->createPost($user, $data, $files);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['code']);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data'],
        ], 201);
    }

    /**
     * Update a post (content and privacy only, files cannot be changed).
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
     * Delete a post and its attachments.
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

    /**
     * Get posts by hashtag.
     */
    public function hashtagPosts(string $hashtagName, Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);

        $result = $this->postService->getPostsByHashtag($hashtagName, $page, $perPage);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $result['posts'],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Search hashtag (autocomplete).
     */
    public function searchHashtag(Request $request): JsonResponse
    {
        $keyword = $request->query('q');

        $hashtags = $this->postService->searchHashtags($keyword);

        return response()->json([
            'success' => true,
            'data' => $hashtags,
        ]);
    }

    /**
     * Trending hashtags (Redis).
     */
    public function trendingHashtags(): JsonResponse
    {
        $hashtags = $this->postService->getTrendingHashtags();

        return response()->json([
            'success' => true,
            'data' => $hashtags,
        ]);
    }

    /**
     * Toggle like on a post.
     */
    public function like(Request $request, int $postId): JsonResponse
    {
        $user = $request->user();

        $result = $this->postService->toggleLike($postId, $user->id);

        if (isset($result['success']) && !$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['code'] ?? 404);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Create a comment on a post.
     */
    public function comment(CreateCommentRequest $request, int $id): JsonResponse
    {
        $user = $request->user();

        $result = $this->postService->createComment(
            $id,
            $user->id,
            $request->validated()
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
        ], 201);
    }

    /**
     * Get comments for a post (paginated).
     */
    public function getComments(int $id, Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $perPage = (int) $request->query('per_page', 10);

        $result = $this->postService->getComments($id, $page, $perPage);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['code'] ?? 404);
        }

        return response()->json([
            'success' => true,
            'data' => $result['comments'],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Share a post (creates a new post with parent_id).
     */
    public function share(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        $result = $this->postService->sharePost($id, $user->id);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['code'] ?? 404);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data'],
        ], 201);
    }

    /**
     * Toggle like on a comment.
     */
    public function likeComment(Request $request, int $commentId): JsonResponse
    {
        $user = $request->user();

        $result = $this->postService->toggleCommentLike($commentId, $user->id);

        if (isset($result['success']) && !$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], $result['code'] ?? 404);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    public function adminIndex(Request $request){
        $params = $request->all();
        $posts = $this->postService->getAdminPost($params);
        if($posts){
            return response()->json([
                'success'=>true,
                'data'=>$posts,
            ]);
        }
        return response()->json([
            'success'=>false,
            'message'=> 'Không có bài viết nào',
        ]);

    }

    public function restorePostById(string $id){
        $result = $this->postService->restorePostById($id);
        if ($result){
            return response()->json([
                'success'=>true,
                'data'=>$result,
                'message'=>'Khôi phục bài viết thành công',
            ]);
        }
        return response()->json([
            'success'=>false,
            'message'=> 'Không có bài viết nào',
        ]);
    }

    public function adminDestroy(Request $request, string $id){
        $params=$request->all();
        $post = $this->postService->adminDeletePostById($params['auth_user'], $id);
        if(!empty($post)){
            return response()->json([
                'success'=>true,
                'message'=>'Xóa bài viêt thành công',
            ]);
        }
        return response()->json([
            'success'=>false,
            'message'=>'Xóa bài viết thất bại',
        ]);
    }
    public function adminGetCountByDays(int $days){
        $result = $this->postService->adminGetCountByDays($days);
        return response()->json([
            'data'=>$result,
        ]);
    }

}
