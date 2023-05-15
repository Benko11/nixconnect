<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMedium extends Model
{
    use HasFactory;

    protected $fillable = ['avatar_id', 'banner_id', 'banner_pos_x', 'banner_pos_y'];

    public function user() {
        return $this->hasOne(User::class, 'uuid', 'user_uuid');
    }

    public function avatar() {
        return $this->belongsTo(UserAvatar::class);
    }

    public function banner() {
        return $this->belongsTo(UserBanner::class);
    }
}
