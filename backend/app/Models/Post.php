<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use SoftDeletes;
    use HasFactory;

    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = false;

    /**
     * The name of the "created at" column.
     */
    const CREATED_AT = 'created_at';

    /**
     * Privacy constants
     */
    const PRIVACY_PUBLIC = 'PUBLIC';
    const PRIVACY_FRIENDS = 'FRIENDS';
    const PRIVACY_ONLY_ME = 'ONLY_ME';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'parent_id',
        'content',
        'privacy',
        'likes_count',
        'comments_count',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'deleted_at' => 'datetime',
            'likes_count' => 'integer',
            'comments_count' => 'integer',
        ];
    }

    /**
     * Get the user that owns the post.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent post (if this is a share).
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'parent_id');
    }

    /**
     * Get the shares of this post.
     */
    public function shares(): HasMany
    {
        return $this->hasMany(Post::class, 'parent_id');
    }

    /**
     * Get the media attachments for this post.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(MediaAttachment::class, 'entity_id')
            ->where('entity_type', MediaAttachment::ENTITY_POST);
    }

    /**
     * Check if this post is a share.
     */
    public function isShare(): bool
    {
        return $this->parent_id !== null;
    }
}
