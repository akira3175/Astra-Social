<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permission extends Model{
    use SoftDeletes;
    
    protected $table = 'permissions';

    protected $fillable = [
        'slug',
        'group',
        'description',
    ];

    protected $dates=[
        'created_at',
        'deleted_at',
        'updated_at',
    ];

    public function roles(){
        return $this->hasMany(Role_permissions::class, 'permission_id');
    }
}
