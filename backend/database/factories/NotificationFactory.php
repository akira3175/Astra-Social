<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Notification;

class NotificationFactory extends Factory{

    public function definition(): array{
        return [
            'receiver_id'=> $this->faker->numberBetween(1,1),
            'actor_id' =>$this->faker->numberBetween(1,1),
            'entity_type' => $this->faker->randomElement([
                Notification::ENTITY_TYPE_POST,
                Notification::ENTITY_TYPE_FRIEND,
                Notification::ENTITY_TYPE_USER,
                Notification::ENTITY_TYPE_SYSTEM,
                Notification::ENTITY_TYPE_COMMENT,
            ]),
            'entity_id' => $this->faker->numberBetween(1,1),
            'message' => $this->faker->sentence(100),
        ];
    }
}
