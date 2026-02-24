<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Post;

class PostFactory extends Factory
{

    public function definition(): array
    {
        return [
            'user_id'=> $this->faker->numberBetween(1,1),
            'content' => $this->faker->sentence(100),
            'privacy' => $this->faker->randomElement([
                Post::PRIVACY_PUBLIC,
                Post::PRIVACY_FRIENDS,
                Post::PRIVACY_ONLY_ME,
            ]),
            'parent_id' => null,
            'likes_count' => 0,
            'comments_count' => 0,
        ];
    }
}
