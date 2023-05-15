<?php

namespace App\Http\Traits;

use App\Models\User;
use Illuminate\Support\Facades\DB;

trait Followable {
    public function followers() {
        return $this->belongsToMany(User::class, 'follower_user', 'user_uuid', 'follower_uuid')->withPivot('approved');
    }
    
    public function follow(User $user, bool $approved = true) {
        $user->followers()->attach($this, ['approved' => $approved]);
    }

    public function unfollow(User $user) {
        $user->followers()->detach($this);
    }

    public function following() {
        return $this->belongsToMany(User::class, 'follower_user', 'follower_uuid', 'user_uuid')->withPivot('approved');
    }

    public function approve(User $user) {
        $user->unfollow($this);
        $user->follow($this);
    }

    public function follows(User $user) {
        return $this->following()->where('user_uuid', $user->uuid)->where('approved', true)->count() > 0;
    }

    public function approves(User $user) {
        if ($user == auth()->user()) return true;
        return DB::table('follower_user')->where(['follower_uuid' => $user->uuid, 'user_uuid' => $this->uuid])->pluck('approved')[0] > 0;
    }
}