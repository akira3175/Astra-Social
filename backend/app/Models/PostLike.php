<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostLike extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'post_id',
        'user_id'
    ];

    protected static function booted()
    {
        static::created(function ($like) {
            Post::where('id', $like->post_id)->increment('likes_count');
        });

        static::deleted(function ($like) {
            Post::where('id', $like->post_id)->decrement('likes_count');
        });
    }
}