<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Report;

class ReportFactory extends Factory
{

    public function definition(): array
    {
        return [
            'reporter_id'=> $this->faker->numberBetween(1,1),
            'target_type' => $this->faker->randomElement([
                Report::TARGET_TYPE_POST,
                Report::TARGET_TYPE_USER,
                Report::TARGET_TYPE_COMMENT,
            ]),
            'target_id' => $this->faker->numberBetween(1,1),
            'reason' => $this->faker->sentence(100),
            'status' => $this->faker->randomElement([
                Report::STATUS_PENDING,
                Report::STATUS_RESOLVED,
                Report::STATUS_REJECTED,
            ]),
        ];
    }
}
