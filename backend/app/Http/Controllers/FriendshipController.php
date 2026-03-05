<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Friendship;
use Illuminate\Support\Facades\Auth;
class FriendshipController extends Controller
{
    public function sendRequest(Request $request, $userId)
    {
        $authUser = $request->user();

        Friendship::create([
            'requester_id' => $authUser->id,
            'receiver_id'  => $userId,
            'status'       => 'pending',
        ]);

        return response()->json([
            'message' => 'Friend request sent successfully.'
        ]);
    }

    public function acceptRequest(Request $request, $userId)
    {
        $authUser = $request->user();

        $friendship = Friendship::where('requester_id',$userId)->where('receiver_id',$authUser->id)
        ->where('status','pending')->first();
        $friendship->update([
            'status' => 'accepted'
        ]);

        return response()->json([
            'message' => 'Friend request accepted'
        ]);
    }
}
