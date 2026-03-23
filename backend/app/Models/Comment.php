<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use SoftDeletes, HasFactory;

    protected $table = 'comments';

    protected $fillable = [
        'id',
        'post_id',
        'user_id',
        'parent_id',
        'content',
    ];

    protected $dates = [
        'deleted_at',
        'created_at',
        'updated_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    public function likes()
    {
        return $this->hasMany(CommentLike::class);
    }

    protected static function booted()
    {
        static::created(function ($comment) {
            Post::where('id', $comment->post_id)->increment('comments_count');
        });

        static::deleted(function ($comment) {
            Post::where('id', $comment->post_id)->decrement('comments_count');
        });

        static::restored(function ($comment) {
            Post::where('id', $comment->post_id)->increment('comments_count');
        });
    }
}
