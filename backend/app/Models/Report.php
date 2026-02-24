<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Report extends Model{
    use HasFactory;
    public $timestamps = false;

    const STATUS_PENDING = 'PENDING';
    const STATUS_RESOLVED = 'RESOLVED';
    const STATUS_REJECTED = 'REJECTED';

    const TARGET_TYPE_POST = 'POST';
    const TARGET_TYPE_USER = 'USER';
    const TARGET_TYPE_COMMENT = 'COMMENT';

    protected $table= 'reports';
    protected $fillable = [
        'reporter_id',
        'target_type',
        'target_id',
        'reason',
        'status',
    ];
    
    public function reporter(){
        return $this->belongsTo(User::class, 'reporter_id');
    }    
}
