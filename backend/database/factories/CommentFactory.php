<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Comment;

class CommentFactory extends Factory{

    public function definition(): array{
        return [
            'post_id'=>$this->faker->numberBetween(1,20),
            'user_id' => $this->faker->numberBetween(1,20),
            // 'parent_id'=>$this->faker->numberBetween(1,20),
            'content'=>$this->faker->sentence(1,10),
        ];
    }
}
