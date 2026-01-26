<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuthToken extends Model
{
    /**
     * Indicates if the model should be timestamped.
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'token',
        'type',
        'expires_at',
        'is_used',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'is_used' => 'boolean',
        ];
    }

    /**
     * Token types
     */
    const TYPE_REFRESH = 'REFRESH';
    const TYPE_OTP_EMAIL = 'OTP_EMAIL';
    const TYPE_OTP_PASS = 'OTP_PASS';

    /**
     * Get the user that owns this token.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include non-expired tokens.
     */
    public function scopeNotExpired($query)
    {
        return $query->where('expires_at', '>', now());
    }

    /**
     * Scope a query to only include unused tokens.
     */
    public function scopeNotUsed($query)
    {
        return $query->where('is_used', false);
    }

    /**
     * Scope a query to only include valid tokens (not expired and not used).
     */
    public function scopeValid($query)
    {
        return $query->notExpired()->notUsed();
    }

    /**
     * Mark this token as used.
     */
    public function markAsUsed(): bool
    {
        return $this->update(['is_used' => true]);
    }

    /**
     * Check if the token is valid.
     */
    public function isValid(): bool
    {
        return !$this->is_used && $this->expires_at->isFuture();
    }
}
