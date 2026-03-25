<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model{
    use HasFactory;

    const ENTITY_TYPE_POST = 'POST';
    const ENTITY_TYPE_FRIEND = 'FRIEND';
    const ENTITY_TYPE_USER = 'USER';
    const ENTITY_TYPE_SYSTEM = 'SYSTEM';
    const ENTITY_TYPE_COMMENT = 'COMMENT';

    protected $table = 'notifications';
    protected $fillable = [
        'receiver_id',
        'actor_id',
        'entity_type',
        'entity_id',
        'message',
        'is_read',
    ];

    protected $appends = ['isRead', 'actorId', 'receiverId', 'entityType', 'entityId'];

    public function getIsReadAttribute() { return $this->attributes['is_read'] ?? null; }
    public function getActorIdAttribute() { return $this->attributes['actor_id'] ?? null; }
    public function getReceiverIdAttribute() { return $this->attributes['receiver_id'] ?? null; }
    public function getEntityTypeAttribute() { return $this->attributes['entity_type'] ?? null; }
    public function getEntityIdAttribute() { return $this->attributes['entity_id'] ?? null; }



    protected $dates = [
            'created_at',
            'updated_at',
            'deleted_at',
    ];

    public function receiver(){
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function actor(){
        return $this->belongsTo(User::class, 'actor_id');
    }

}
