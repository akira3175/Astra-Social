<?php

namespace App\Services;

use App\Models\Hashtag;
use App\Models\Post;
use Illuminate\Support\Facades\Redis;

class HashtagService
{
    /**
     * Extract hashtags from content
     */
    public function extract(string $content): array
    {
        preg_match_all('/#([\pL\pN_]+)/u', $content, $matches);

        return array_unique(
            array_map('strtolower', $matches[1])
        );
    }

    /**
     * Save hashtags for a post
     */
    public function attachToPost(Post $post, array $tags): void
    {
        foreach ($tags as $tag) {

            $hashtag = Hashtag::firstOrCreate([
                'name' => $tag
            ]);

            $post->hashtags()->syncWithoutDetaching([
                $hashtag->id
            ]);

            $hashtag->increment('posts_count');

            // update redis trending
            try {
                Redis::zincrby('trending:hashtags', 1, $tag);
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Redis connection failed or class not found when updating trending hashtags: ' . $e->getMessage());
            }
        }
    }

    /**
     * Remove or decrement hashtags when a post is deleted
     */
    public function detachFromPost(Post $post): void
    {
        $hashtags = $post->hashtags()->get();

        foreach ($hashtags as $hashtag) {
            if ($hashtag->posts_count > 0) {
                $hashtag->decrement('posts_count');
            }

            try {
                Redis::zincrby('trending:hashtags', -1, $hashtag->name);
                $score = Redis::zscore('trending:hashtags', $hashtag->name);
                if ($score !== false && $score <= 0) {
                    Redis::zrem('trending:hashtags', $hashtag->name);
                }
            } catch (\Throwable $e) {
                // Ignore redis failures
            }
        }
    }

    /**
     * Sync hashtags when a post is updated
     */
    public function syncForPost(Post $post, array $newTags): void
    {
        $currentTags = $post->hashtags()->pluck('name')->toArray();
        
        $addedTags = array_diff($newTags, $currentTags);
        $removedTags = array_diff($currentTags, $newTags);
        
        // Decrement removed
        if (!empty($removedTags)) {
            $hashtagsToRemove = Hashtag::whereIn('name', $removedTags)->get();
            foreach ($hashtagsToRemove as $hashtag) {
                if ($hashtag->posts_count > 0) {
                    $hashtag->decrement('posts_count');
                }
                try {
                    Redis::zincrby('trending:hashtags', -1, $hashtag->name);
                    $score = Redis::zscore('trending:hashtags', $hashtag->name);
                    if ($score !== false && $score <= 0) {
                        Redis::zrem('trending:hashtags', $hashtag->name);
                    }
                } catch (\Throwable $e) {}
            }
            $post->hashtags()->detach($hashtagsToRemove->pluck('id'));
        }
        
        // Increment added
        if (!empty($addedTags)) {
            $this->attachToPost($post, $addedTags);
        }
    }
}