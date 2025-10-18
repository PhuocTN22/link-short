<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Url extends Model
{
    use HasFactory;

    // Nếu bạn có cột clicks_count trong bảng urls
    protected $fillable = ['slug', 'target_url', 'user_id', 'clicks_count'];

    // Nếu chưa có cột clicks_count thì bỏ nó khỏi $fillable (và xem phần Migration bên dưới)

    public function clicks()
    {
        return $this->hasMany(Click::class);
    }
}