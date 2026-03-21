<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $casts = [
    'created_at' => 'datetime',
];
    protected $table = 'messages';

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
    ];

    // Trỏ về hội thoại chứa tin nhắn này
    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id');
    }

    // Trỏ về người gửi tin nhắn
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
    
}