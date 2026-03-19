<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role_permissions extends Model{
    use HasFactory;
    use SoftDeletes;
    
    protected $table='role_permissions';
    protected $fillable = [
        'role_id',
        'permission_id',
    ];

    protected $dates=[
        'created_at',
        'deleted_at',
        'updated_at',
    ];
    public function roles(){
        return $this->belongsTo(Role::class, 'role_id');
    }
    public function permissions(){
        return $this->belongsTo(Permission::class, 'permission_id');
    }
}
