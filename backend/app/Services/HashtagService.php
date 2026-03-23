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
}