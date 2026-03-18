<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserBlock extends Model
{
    protected $table = 'user_blocks';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'blocker_id',
        'blocked_id',
    ];

    /**
     * Get the user who blocked.
     */
    public function blocker()
    {
        return $this->belongsTo(User::class, 'blocker_id');
    }

    /**
     * Get the user who was blocked.
     */
    public function blockedUser()
    {
        return $this->belongsTo(User::class, 'blocked_id');
    }
}
