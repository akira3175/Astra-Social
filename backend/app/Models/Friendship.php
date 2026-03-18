<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{
    protected $table = 'friendships';

    protected $fillable = [
        'requester_id',
        'receiver_id',
        'status',
        'accepted_at',
    ];

    public $timestamps = false;

    protected $casts = [
        'accepted_at' => 'datetime',
    ];

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id'); 
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeBetween($query, $userId1, $userId2)
    {
        return $query->where(function ($q) use ($userId1, $userId2) {
            $q->where('requester_id', $userId1)->where('receiver_id', $userId2);
        })->orWhere(function ($q) use ($userId1, $userId2) {
            $q->where('requester_id', $userId2)->where('receiver_id', $userId1);
        });
    }

    public function scopeInvolving($query, $userId)
    {
        return $query->where('requester_id', $userId)
                     ->orWhere('receiver_id', $userId);
    }
}