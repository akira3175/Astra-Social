<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\MediaAttachment;
use App\Models\User;
use App\Models\Post;
use App\Models\Notification;
use App\Services\NotificationService;
use App\Models\Hashtag;
use App\Models\PostLike;
use App\Models\CommentLike;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Redis;

class PostService
{
    public function __construct(
        private MediaService $mediaService,
        private NotificationService $notiService,
        private HashtagService $hashtagService
    ) {
    }

    /**
     * Get paginated posts (newsfeed) — simple public feed.
     */
    public function getPosts(int $page = 1, int $perPage = 10, ?int $userId = null): array
    {
        $query = Post::query()
            ->with([
                'user:id,username',
                'user.profile:user_id,first_name,last_name,avatar_url',
                'attachments:id,url,file_type,entity_type,entity_id',

                // Eager load bài gốc khi share
                'parent',
                'parent.user:id,username',
                'parent.user.profile:user_id,first_name,last_name,avatar_url',
                'parent.attachments:id,url,file_type,entity_type,entity_id',

                'comments' => function ($q) {
                    $q->latest()->limit(10);
                },
                'comments.user:id,username',
                'comments.user.profile:user_id,first_name,last_name,avatar_url',
            ])

            // privacy
            ->where(function ($q) use ($userId) {
                $q->where('privacy', Post::PRIVACY_PUBLIC);

                if ($userId) {
                    $q->orWhere('user_id', $userId);
                }
            })
            ->withCount(['likes', 'comments'])
            ->when($userId, function (Builder $q) use ($userId) {
                $q->withExists([
                    'likes as is_liked' => function ($sub) use ($userId) {
                        $sub->where('user_id', $userId);
                    }
                ]);
            })

            ->orderByDesc('created_at');

        $posts = $query->paginate($perPage, ['*'], 'page', $page);

        return [
            'posts' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page'    => $posts->lastPage(),
                'per_page'     => $posts->perPage(),
                'total'        => $posts->total(),
            ],
        ];
    }

    /**
     * Get ranked News Feed for a logged-in user.
     *
     * Scoring formula (computed in raw SQL for performance):
     *   score = (likes_count * 2)
     *         + (comments_count * 3)
     *         + relationship_boost   (+10 friend, +5 following, +1 others)
     *         + media_boost          (+4 if has attachments)
     *         - (age_hours * 0.3)    (time decay)
     */
    public function getNewsFeed(int $userId, int $page = 1, int $perPage = 10): array
    {
        // 1. Get IDs of friends (accepted friendships) and followees
        $friendIds = DB::table('friendships')
            ->where('status', 'ACCEPTED')
            ->where(function ($q) use ($userId) {
                $q->where('requester_id', $userId)
                    ->orWhere('receiver_id', $userId);
            })
            ->get()
            ->map(fn($f) => $f->requester_id === $userId ? $f->receiver_id : $f->requester_id)
            ->toArray();

        $followeeIds = DB::table('follows')
            ->where('follower_id', $userId)
            ->pluck('followee_id')
            ->toArray();

        // 2. Visibility: PUBLIC posts of everyone + FRIENDS posts of friends + own posts
        $query = Post::query()
            ->with([
                'user:id,username',
                'user.profile:user_id,first_name,last_name,avatar_url',
                'attachments:id,url,file_type,entity_type,entity_id',
                'comments' => fn($q) => $q->latest()->limit(3),
                'comments.user:id,username',
                'comments.user.profile:user_id,first_name,last_name,avatar_url',
            ])
            ->withExists([
                'likes as is_liked' => fn($sub) => $sub->where('user_id', $userId),
            ])
            // SoftDeletes global scope already adds deleted_at IS NULL — no need to repeat
            ->where(function ($q) use ($userId, $friendIds) {
                // Public posts of everyone
                $q->where('privacy', Post::PRIVACY_PUBLIC)
                    // Own posts regardless of privacy
                    ->orWhere('user_id', $userId)
                    // Friends-only posts from actual friends
                    ->orWhere(function ($sub) use ($friendIds) {
                    if (!empty($friendIds)) {
                        $sub->where('privacy', Post::PRIVACY_FRIENDS)
                            ->whereIn('user_id', $friendIds);
                    }
                });
            });

        // 3. Build relationship_boost CASE expression
        $friendPlaceholders = count($friendIds)
            ? implode(',', array_fill(0, count($friendIds), '?'))
            : 'NULL';
        $followPlaceholders = count($followeeIds)
            ? implode(',', array_fill(0, count($followeeIds), '?'))
            : 'NULL';

        $relationBoostExpr = count($friendIds)
            ? "CASE WHEN posts.user_id IN ({$friendPlaceholders}) THEN 10 WHEN posts.user_id IN ({$followPlaceholders}) THEN 5 ELSE 1 END"
            : (count($followeeIds)
                ? "CASE WHEN posts.user_id IN ({$followPlaceholders}) THEN 5 ELSE 1 END"
                : "1");

        $bindings = array_merge($friendIds, $followeeIds);

        // 4. Add score column
        // Gravity decay: Score = Base / (AgeHours + 2)^1.5
        $query->selectRaw(
            "posts.*, (
                (
                    (posts.likes_count * 3)
                    + (posts.comments_count * 10)
                    + ((SELECT COUNT(*) FROM posts shares WHERE shares.parent_id = posts.id AND shares.deleted_at IS NULL) * 15)
                    + ({$relationBoostExpr})
                    + (CASE WHEN EXISTS (SELECT 1 FROM media_attachments ma WHERE ma.entity_id = posts.id AND ma.entity_type = 'POST') THEN 4 ELSE 0 END)
                    + (CASE WHEN TIMESTAMPDIFF(MINUTE, posts.created_at, NOW()) < 60 THEN 20 ELSE 0 END)
                ) / POWER(TIMESTAMPDIFF(HOUR, posts.created_at, NOW()) + 2, 1.5)
            ) AS feed_score",
            $bindings
        );

        $query->orderByDesc('feed_score');

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
    public function getPostById(int $id, ?int $userId = null): array
    {
        $post = Post::with([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'attachments:id,url,file_type,entity_type,entity_id',
            'parent',
            'parent.user:id,username',
            'parent.user.profile:user_id,first_name,last_name,avatar_url',
            'parent.attachments:id,url,file_type,entity_type,entity_id',
            'comments' => function ($q) {
                $q->latest()->limit(10);
            },
            'comments.user:id,username',
            'comments.user.profile:user_id,first_name,last_name,avatar_url',
        ])
            ->when($userId, function (Builder $q) use ($userId) {
                $q->withExists([
                    'likes as is_liked' => fn($sub) => $sub->where('user_id', $userId)
                ]);
            })
            ->find($id);

        if (!$post) {
            return ['success' => false, 'message' => 'Post not found'];
        }

        return ['success' => true, 'data' => $post];
    }

    /**
     * Get posts by user ID.
     */
    public function getPostsByUserId(int $userId, int $page = 1, int $perPage = 10, ?int $currentUserId = null): array
    {
        $posts = Post::with([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'attachments:id,url,file_type,entity_type,entity_id',
            'parent',
            'parent.user:id,username',
            'parent.attachments:id,url,file_type,entity_type,entity_id',
        ])
            ->when($currentUserId, function (Builder $q) use ($currentUserId) {
                $q->withExists([
                    'likes as is_liked' => function ($sub) use ($currentUserId) {
                        $sub->where('user_id', $currentUserId);
                    }
                ]);
            })
            ->where('user_id', $userId)
            ->where('privacy', Post::PRIVACY_PUBLIC)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'posts' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page'    => $posts->lastPage(),
                'per_page'     => $posts->perPage(),
                'total'        => $posts->total(),
            ],
        ];
    }

    /**
     * Get all posts by the currently logged-in user.
     */
    public function getMyPosts(int $userId, int $page = 1, int $perPage = 10): array
    {
        $posts = Post::with([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'attachments:id,url,file_type,entity_type,entity_id',
            'parent',
            'parent.user:id,username',
            'parent.attachments:id,url,file_type,entity_type,entity_id',
        ])
            ->withExists([
                'likes as is_liked' => function ($sub) use ($userId) {
                    $sub->where('user_id', $userId);
                }
            ])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'posts' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page'    => $posts->lastPage(),
                'per_page'     => $posts->perPage(),
                'total'        => $posts->total(),
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
                'code' => 422
            ];
        }

        $post = Post::create([
            'user_id' => $user->id,
            'parent_id' => $data['parent_id'] ?? null,
            'content' => $data['content'] ?? null,
            'privacy' => $data['privacy'] ?? Post::PRIVACY_PUBLIC,
        ]);

        if (!empty($data['content'])) {
            $tags = $this->hashtagService->extract($data['content']);
            $this->hashtagService->attachToPost($post, $tags);

            foreach ($tags as $tag) {
                try {
                    Redis::zincrby('trending:hashtags', 1, $tag);
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::warning('Redis connection failed in PostService: ' . $e->getMessage());
                }
            }
        }

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
            'parent.user.profile:user_id,first_name,last_name,avatar_url',
            'parent.attachments:id,url,file_type,entity_type,entity_id',
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
            return ['success' => false, 'message' => 'Post not found', 'code' => 404];
        }

        if ($post->user_id !== $userId) {
            return ['success' => false, 'message' => 'You can only update your own posts', 'code' => 403];
        }

        $post->fill(array_intersect_key($data, array_flip(['content', 'privacy'])));
        $post->save();

        if (array_key_exists('content', $data)) {
            $tags = $this->hashtagService->extract($data['content'] ?? '');
            $this->hashtagService->syncForPost($post, $tags);
        }

        $post->load([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'attachments:id,url,file_type,entity_type,entity_id',
        ]);

        return ['success' => true, 'data' => $post];
    }

    /**
     * Delete a post (soft delete) and its attachments.
     */
    public function deletePost(int $postId, int $userId): array
    {
        $post = Post::find($postId);

        if (!$post) {
            return ['success' => false, 'message' => 'Post not found', 'code' => 404];
        }

        if ($post->user_id !== $userId) {
            return ['success' => false, 'message' => 'You can only delete your own posts', 'code' => 403];
        }

        // Delete attachments from Cloudinary and database
        $this->mediaService->deleteForEntity(MediaAttachment::ENTITY_POST, $post->id);

        $this->hashtagService->detachFromPost($post);

        $post->delete();

        return [
            'success' => true,
            'message' => 'Post deleted successfully',
        ];
    }

    //  Admin 

    public function getAdminPost(array $params)
    {
        $data = Post::query()
            ->with('user')
            ->orderBy('created_at', 'desc');

        if (empty($params['status'])) {
            $data->withTrashed();
        }
        if (strtolower($params['status'] ?? '') === 'deleted') {
            $data->onlyTrashed();
        }
        if (!empty($params['privacy'])) {
            $data->where('privacy', $params['privacy']);
        }
        if (!empty($params['search'])) {
            $data->where('content', 'like', '%' . $params['search'] . '%');
        }

        return $data->paginate(10);
    }

    public function restorePostById(string $id)
    {
        $post = Post::withTrashed()->find((int) $id);
        if ($post) {
            $post->restore();

            if (!empty($post->content)) {
                $tags = $this->hashtagService->extract($post->content);
                $this->hashtagService->attachToPost($post, $tags);
            }

            return $post;
        }
        return false;
    }

    public function adminDeletePostById(User $auth_user, string $id)
    {
        $post = Post::find($id);
        if (empty($post)) return false;

        $this->hashtagService->detachFromPost($post);

        $post->delete();

        $this->notiService->create([
            'receiver_id' => $post->user_id,
            'actor_id'    => $auth_user->id,
            'entity_type' => Notification::ENTITY_TYPE_POST,
            'entity_id'   => $id,
            'message'     => 'Bài viết của bạn đã bị gỡ bỏ',
        ]);

        return true;
    }

    public function adminGetCountByDays(int $days)
    {
        return Post::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as total')
        )
        ->where('created_at', '>=', now()->subDays($days))
        ->groupBy('date')
        ->get();
    }

    // Hashtag 

    public function getPostsByHashtag(string $hashtagName, int $page = 1, int $perPage = 10): array
    {
        $hashtagName = strtolower(ltrim(trim($hashtagName), '#'));
        $hashtag = Hashtag::where('name', $hashtagName)->first();

        if (!$hashtag) {
            return ['success' => false, 'message' => 'Hashtag not found'];
        }

        $posts = $hashtag->posts()
            ->whereNull('posts.deleted_at')
            ->with([
                'user:id,username',
                'user.profile:user_id,first_name,last_name,avatar_url',
                'attachments:id,url,file_type,entity_type,entity_id',
            ])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'success'    => true,
            'posts'      => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page'    => $posts->lastPage(),
                'per_page'     => $posts->perPage(),
                'total'        => $posts->total(),
            ],
        ];
    }

    public function searchHashtags(?string $keyword): array
    {
        if (!$keyword) return [];

        $keyword = ltrim(strtolower($keyword), '#');

        return Hashtag::where('name', 'like', $keyword . '%')
            ->orderByDesc('posts_count')
            ->limit(10)
            ->get(['id', 'name', 'posts_count'])
            ->toArray();
    }

    public function getTrendingHashtags(): array
    {
        try {
            $redisData = Redis::zrevrange('trending:hashtags', 0, 9, 'WITHSCORES');
            if (!empty($redisData)) {
                // If it's an associative array (phpredis), convert to flat array for frontend
                if (is_array($redisData) && !array_is_list($redisData)) {
                    $flat = [];
                    foreach ($redisData as $key => $value) {
                        $flat[] = $key;
                        $flat[] = (string) $value;
                    }
                    return $flat;
                }
                return $redisData;
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Redis connection failed in getTrendingHashtags: ' . $e->getMessage());
        }

        // Fallback to database if Redis fails or is empty
        $hashtags = \App\Models\Hashtag::orderByDesc('posts_count')
            ->limit(10)
            ->get(['name', 'posts_count']);

        $formatted = [];
        foreach ($hashtags as $hashtag) {
            $formatted[] = $hashtag->name;
            $formatted[] = (string) $hashtag->posts_count;
        }

        return $formatted;
    }

    // Search 

    /**
     * Tìm kiếm tổng hợp: users + posts (content + hashtag).
     * Trả về { users, posts, pagination_posts }
     */
    public function search(string $keyword, int $page = 1, int $perPage = 10): array
    {
        $keyword = trim($keyword);
        if ($keyword === '') {
            return ['users' => [], 'posts' => [], 'pagination' => null];
        }

        //  Tìm users theo username hoặc first_name/last_name 
        $users = User::query()
            ->with('profile:user_id,first_name,last_name,avatar_url')
            ->where(function ($q) use ($keyword) {
                $q->where('username', 'like', '%' . $keyword . '%')
                  ->orWhereHas('profile', function ($pq) use ($keyword) {
                      $pq->where(
                          DB::raw("CONCAT(COALESCE(first_name,''), ' ', COALESCE(last_name,''))"),
                          'like',
                          '%' . $keyword . '%'
                      );
                  });
            })
            ->limit(10)
            ->get(['id', 'username', 'email']);

        //  Tìm posts theo content hoặc hashtag 
        $cleanKeyword = ltrim($keyword, '#');

        $posts = Post::query()
            ->with([
                'user:id,username',
                'user.profile:user_id,first_name,last_name,avatar_url',
                'attachments:id,url,file_type,entity_type,entity_id',
                'parent',
                'parent.user:id,username',
                'parent.attachments:id,url,file_type,entity_type,entity_id',
            ])
            ->withCount(['likes', 'comments'])
            ->where('privacy', Post::PRIVACY_PUBLIC)
            ->where(function ($q) use ($cleanKeyword) {
                // Tìm theo nội dung bài viết
                $q->where('content', 'like', '%' . $cleanKeyword . '%')
                  // Hoặc bài viết có hashtag khớp
                  ->orWhereHas('hashtags', function ($hq) use ($cleanKeyword) {
                      $hq->where('name', 'like', $cleanKeyword . '%');
                  });
            })
            ->orderByDesc('created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'users' => $users,
            'posts' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page'    => $posts->lastPage(),
                'per_page'     => $posts->perPage(),
                'total'        => $posts->total(),
            ],
        ];
    }

    // Like 

    public function toggleLike(int $postId, int $userId): array
    {
        $post = Post::find($postId);
        if (!$post) {
            return ['success' => false, 'message' => 'Post not found', 'code' => 404];
        }

        $like = PostLike::where('post_id', $postId)->where('user_id', $userId)->first();

        if ($like) {
            $like->delete();
            return ['liked' => false];
        }

        PostLike::create(['post_id' => $postId, 'user_id' => $userId]);

        // Notify the post owner (skip self-like)
        if ($post->user_id !== $userId) {
            $this->notiService->create([
                'receiver_id' => $post->user_id,
                'actor_id'    => $userId,
                'type'        => 'LIKE',
                'entity_type' => Notification::ENTITY_TYPE_POST,
                'entity_id'   => $postId,
                'message'     => 'đã thích bài viết của bạn',
            ]);
        }

        return ['liked' => true];
    }

    /**
     * Toggle like on a comment.
     */
    public function toggleCommentLike(int $commentId, int $userId): array
    {
        if (!Comment::find($commentId)) {
            return ['success' => false, 'message' => 'Comment not found', 'code' => 404];
        }

        $like = CommentLike::where('comment_id', $commentId)->where('user_id', $userId)->first();

        if ($like) {
            $like->delete();
            return ['liked' => false];
        }

        CommentLike::create(['comment_id' => $commentId, 'user_id' => $userId]);
        return ['liked' => true];
    }

    //  Comment 

    public function createComment(int $postId, int $userId, array $data): array
    {
        $post = Post::find($postId);

        if (!$post) {
            return ['success' => false, 'message' => 'Post not found', 'code' => 404];
        }

        if (!empty($data['parent_id'])) {
            $parentExists = Comment::where('id', $data['parent_id'])
                ->where('post_id', $postId)
                ->exists();

            if (!$parentExists) {
                return ['success' => false, 'message' => 'Parent comment not found in this post', 'code' => 404];
            }
        }

        $comment = Comment::create([
            'post_id'   => $postId,
            'user_id'   => $userId,
            'parent_id' => $data['parent_id'] ?? null,
            'content'   => $data['content'],
        ]);

        $comment->load([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
        ]);

        // Notify based on comment type
        if (!empty($data['parent_id'])) {
            // REPLY: notify the parent comment's author
            $parentComment = Comment::find($data['parent_id']);
            if ($parentComment && $parentComment->user_id !== $userId) {
                $this->notiService->create([
                    'receiver_id' => $parentComment->user_id,
                    'actor_id'    => $userId,
                    'type'        => 'REPLY',
                    'entity_type' => Notification::ENTITY_TYPE_POST,
                    'entity_id'   => $postId,
                    'message'     => 'đã trả lời bình luận của bạn',
                ]);
            }
        } else {
            // COMMENT: notify the post owner (skip self-comment)
            if ($post->user_id !== $userId) {
                $this->notiService->create([
                    'receiver_id' => $post->user_id,
                    'actor_id'    => $userId,
                    'type'        => 'COMMENT',
                    'entity_type' => Notification::ENTITY_TYPE_POST,
                    'entity_id'   => $postId,
                    'message'     => 'đã bình luận về bài viết của bạn',
                ]);
            }
        }

        return ['success' => true, 'data' => $comment];
    }

    /**
     * Get paginated comments for a post (root level only, replies eager loaded).
     */
    public function getComments(int $postId, int $page = 1, int $perPage = 10): array
    {
        if (!Post::find($postId)) {
            return ['success' => false, 'message' => 'Post not found', 'code' => 404];
        }

        $comments = Comment::with([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'replies' => function ($q) { $q->withCount('likes')->latest(); },
            'replies.user:id,username',
            'replies.user.profile:user_id,first_name,last_name,avatar_url',
        ])
        ->withCount('likes')
        ->where('post_id', $postId)
        ->whereNull('parent_id')
        ->latest()
        ->paginate($perPage, ['*'], 'page', $page);

        return [
            'success'    => true,
            'comments'   => $comments->items(),
            'pagination' => [
                'current_page' => $comments->currentPage(),
                'last_page'    => $comments->lastPage(),
                'per_page'     => $comments->perPage(),
                'total'        => $comments->total(),
            ],
        ];
    }

    // Share 

    /**
     * Share bài viết: tạo post mới với caption tùy chọn, embed bài gốc qua parent_id.
     */
    public function sharePost(int $postId, int $userId, ?string $caption = null): array
    {
        $original = Post::with([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'attachments:id,url,file_type,entity_type,entity_id',
        ])->find($postId);

        if (!$original) {
            return ['success' => false, 'message' => 'Post not found', 'code' => 404];
        }

        // Không share bài đã là share (tránh share chain vô tận)
        // Luôn trỏ về bài gốc thật sự
        $rootId = $original->parent_id ?? $original->id;

        $shared = Post::create([
            'user_id'   => $userId,
            'parent_id' => $rootId,
            'content'   => $caption,                        // caption của người share (nullable)
            'privacy'   => Post::PRIVACY_PUBLIC,
        ]);

        $shared->load([
            'user:id,username',
            'user.profile:user_id,first_name,last_name,avatar_url',
            'parent',                                        // bài gốc đầy đủ
            'parent.user:id,username',
            'parent.user.profile:user_id,first_name,last_name,avatar_url',
            'parent.attachments:id,url,file_type,entity_type,entity_id',
        ]);

        // Thông báo cho chủ bài gốc
        if ($original->user_id !== $userId) {
            $this->notiService->create([
                'receiver_id' => $original->user_id,
                'actor_id'    => $userId,
                'entity_type' => Notification::ENTITY_TYPE_POST,
                'entity_id'   => $shared->id,
                'message'     => 'đã chia sẻ bài viết của bạn',
            ]);
        }

        return ['success' => true, 'data' => $shared];
    }
}