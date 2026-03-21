<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasFactory;
    use SoftDeletes;

    public $timestamps = false;

    const CREATED_AT = 'created_at';

    protected $fillable = [
        'username',
        'email',
        'password',
        'role_id',
        'is_active',
        'is_verified',
        'last_login',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
            'last_login' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function authTokens(): HasMany
    {
        return $this->hasMany(AuthToken::class);
    }

    public function refreshTokens(): HasMany
    {
        return $this->authTokens()->where('type', AuthToken::TYPE_REFRESH);
    }

    public function updateLastLogin(): bool
    {
        return $this->update(['last_login' => now()]);
    }


    public function friends()
    {
        $friendIds = Friendship::where('status', 'accepted')
            ->where(function ($q) {
                $q->where('requester_id', $this->id)
                  ->orWhere('receiver_id', $this->id);
            })
            ->get()
            ->map(function ($friendship) {
                return $friendship->requester_id === $this->id
                    ? $friendship->receiver_id
                    : $friendship->requester_id;
            });

        return self::whereIn('id', $friendIds);
    }
    public function sentFriendRequests()
    {
        return $this->hasMany(Friendship::class, 'requester_id');
    }

    public function receivedFriendRequests()
    {
        return $this->hasMany(Friendship::class, 'receiver_id');
    }
    public function pendingFriendRequestsReceived()
    {
        return $this->hasMany(Friendship::class, 'receiver_id')
                    ->where('status', 'pending');
    }

    public function pendingFriendRequestsSent()
    {
        return $this->hasMany(Friendship::class, 'requester_id')
                    ->where('status', 'pending');
    }


    public function blockedUsers()
    {
        return $this->hasMany(UserBlock::class, 'blocker_id');
    }

 
    public function blockedByUsers()
    {
        return $this->hasMany(UserBlock::class, 'blocked_id');
    }


    public function isFriendWith(int $userId): bool
    {
        return Friendship::accepted()->between($this->id, $userId)->exists();
    }

    public function hasBlockedUser(int $userId): bool
    {
        return UserBlock::where('blocker_id', $this->id)
                        ->where('blocked_id', $userId)
                        ->exists();
    }

    public function isBlockedBy(int $userId): bool
    {
        return UserBlock::where('blocker_id', $userId)
                        ->where('blocked_id', $this->id)
                        ->exists();
    }
    public function conversations()
    {
        return $this->belongsToMany(Conversation::class, 'conversation_members', 'user_id', 'conversation_id')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }
}
