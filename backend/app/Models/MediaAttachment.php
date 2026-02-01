<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaAttachment extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'media_attachments';

    /**
     * Disable updated_at since we only have created_at.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'url',
        'file_type',
        'entity_type',
        'entity_id',
        'created_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * File type constants.
     */
    public const FILE_TYPE_IMAGE = 'IMAGE';
    public const FILE_TYPE_VIDEO = 'VIDEO';
    public const FILE_TYPE_FILE = 'FILE';

    /**
     * Entity type constants.
     */
    public const ENTITY_POST = 'POST';
    public const ENTITY_COMMENT = 'COMMENT';
    public const ENTITY_MESSAGE = 'MESSAGE';

    /**
     * Get the parent entity (Post, Comment, or Message).
     */
    public function entity()
    {
        return match ($this->entity_type) {
            self::ENTITY_POST => $this->belongsTo(Post::class, 'entity_id'),
            self::ENTITY_COMMENT => $this->belongsTo(Comment::class, 'entity_id'),
            self::ENTITY_MESSAGE => $this->belongsTo(Message::class, 'entity_id'),
            default => null,
        };
    }

    /**
     * Scope for getting attachments by entity.
     */
    public function scopeForEntity($query, string $entityType, int $entityId)
    {
        return $query->where('entity_type', $entityType)
                     ->where('entity_id', $entityId);
    }

    /**
     * Scope for images only.
     */
    public function scopeImages($query)
    {
        return $query->where('file_type', self::FILE_TYPE_IMAGE);
    }

    /**
     * Scope for videos only.
     */
    public function scopeVideos($query)
    {
        return $query->where('file_type', self::FILE_TYPE_VIDEO);
    }
}
