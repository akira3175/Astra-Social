<?php

namespace Database\Seeders;

use App\Models\Friendship;
use App\Models\User;
use Illuminate\Database\Seeder;

class FriendshipSeeder extends Seeder
{
    /**
     * Seed 3 accepted friendships for user id 4.
     */
    public function run(): void
    {
        $user = User::find(4);

        if (!$user) {
            return;
        }

        $friendIds = User::query()
            ->where('id', '!=', 4)
            ->orderBy('id')
            ->limit(3)
            ->pluck('id');

        foreach ($friendIds as $friendId) {
            $requesterId = min(4, $friendId);
            $receiverId = max(4, $friendId);

            Friendship::updateOrCreate(
                [
                    'requester_id' => $requesterId,
                    'receiver_id' => $receiverId,
                ],
                [
                    'status' => 'accepted',
                    'accepted_at' => now(),
                ]
            );
        }
    }
}
