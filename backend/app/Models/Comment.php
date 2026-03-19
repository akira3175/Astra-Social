<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'post_id',
        'user_id',
        'parent_id',
        'content'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function replies()
    {
        return $this->hasMany(Comment::class,'parent_id');
    }

    public function likes()
    {
        return $this->hasMany(CommentLike::class);
    }
}
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model{
    use SoftDeletes;
    use HasFactory;

    protected $table='comments';

    protected $fillable=[
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

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function post(){
        return $this->belongsTo(Post::class, 'post_id');
    }
    public function parent(){
        return $this->belongsTo(Comment::class, 'parent_id');
    }
}
