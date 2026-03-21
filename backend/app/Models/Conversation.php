<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $table = 'conversations';

    protected $fillable = [
        'name',
        'type',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    // Lấy danh sách thành viên
    public function members()
    {
        return $this->hasMany(ConversationMember::class, 'conversation_id');
    }

    // Lấy thông tin User của các thành viên trong nhóm
    public function users()
    {
        return $this->belongsToMany(User::class, 'conversation_members', 'conversation_id', 'user_id')
                    ->withPivot('role')
                    ->withTimestamps();
    }

    // Lấy danh sách tin nhắn của hội thoại
    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id');
    }
}