<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model{
    use HasFactory;
    use SoftDeletes;
    
    const STATUS_PENDING = 'PENDING';
    const STATUS_RESOLVED = 'RESOLVED';
    const STATUS_REJECTED = 'REJECTED';

    const TARGET_TYPE_POST = 'POST';
    const TARGET_TYPE_USER = 'USER';
    const TARGET_TYPE_COMMENT = 'COMMENT';

    protected $table= 'reports';
    protected $fillable = [
        'reporter_id',
        'target_author_id',
        'target_type',
        'target_preview',
        'target_id',
        'reason',
        'status',
    ];
    protected $dates = [
            'deleted_at',
            'created_at',
            'updated_at',
    ];
    public function reporter(){
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function target_author(){
        return $this->belongsTo(User::class, 'target_author_id');
    }

}
