<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'is_default',
    ];

    protected $dates=[
        'created_at',
        'deleted_at',
        'updated_at',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
    public function role_permissions(){
        return $this->hasMany(Role_permissions::class, 'role_id');
    }
}
