<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Friendship;
use Illuminate\Support\Facades\Auth;
class FriendshipController extends Controller
{
   public function sendRequest($userId)
{
    $authUser = Auth::user();

    Friendship::create([
        'requester_id' => $authUser->id,
        'receiver_id'  => $userId,
        'status'       => 'pending',
    ]);

    return response()->json([
        'message' => 'Friend request sent successfully.'
    ]);
}
}
