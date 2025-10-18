<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Click extends Model
{
    use HasFactory;

    protected $fillable = [
        'url_id',
        'ip',
        'user_agent',
        'referrer',
        'country',
    ];

    public function url()
    {
        return $this->belongsTo(Url::class);
    }
}