<?php

namespace App\Http\Traits;

use App\Models\UserAvatar;
use App\Models\UserBanner;
use App\Models\UserMedium;

trait CustomizableProfile {
    public function media() {
        return $this->hasOne(UserMedium::class);
    }

    public function avatars() {
        return $this->hasMany(UserAvatar::class);
    }

    public function addAvatar(string $avatar) {
        $avatarObj = new UserAvatar(['name' => $avatar]);
        $this->avatars()->save($avatarObj);
    }

    public function activateAvatar(UserAvatar $avatar) {
        return $this->media()->update(['avatar_id' => $avatar->id]);
    }

    public function deactivateAvatar() {
        return $this->media()->update(['avatar_id' => null]);
    }

    public function banners() {
        return $this->hasMany(UserBanner::class);
    }

    public function addBanner(string $banner) {
        $bannerObj = new UserBanner(['name' => $banner]);
        $this->banners()->save($bannerObj);
    }
    
    public function activateBanner(UserBanner $banner) {
        return $this->media()->update(['banner_id' => $banner->id]);
    }

    public function deactivateBanner() {
        return $this->media()->update(['banner_id' => null]);
    }
}
