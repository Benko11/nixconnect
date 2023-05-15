<?php

use App\Models\User;
use App\Models\UserAvatar;
use App\Models\UserBanner;
use App\Models\UserMedium;

it('has media associated with the author', function() {
    $user = User::factory()->create();
    $user->addAvatar('avatar.png');
    $userAvatar = UserAvatar::first();

    $user->media()->save(new UserMedium([
        'avatar_id' => $userAvatar->id,
    ]));

    $this->assertInstanceOf(UserMedium::class, User::first()->media);
    $this->assertInstanceOf(User::class, UserMedium::first()->user);
});

it('can set a new avatar', function() {
    $user = User::factory()->create();
    $user->media()->save(new UserMedium);

    $userAvatar = new UserAvatar(['name' => 'avatar.png']); 
    $user->addAvatar($userAvatar['name']);
    $user->activateAvatar($user->avatars()->first()); // id is not available in userAvatar object

    $this->assertDatabaseHas('user_avatars', ['name' => 'avatar.png']);
    $this->assertDatabaseHas('user_media', ['user_uuid' => $user->uuid, 'avatar_id' => $user->avatars()->first()->id]);
});

it('can set a new banner', function() {
    $user = User::factory()->create();
    $user->media()->save(new UserMedium);
    $user->addBanner('banner.png');

    $banner = UserBanner::first();
    $user->activateBanner($banner);

    $this->assertDatabaseHas('user_banners', ['name' => 'banner.png']);
    $this->assertDatabaseHas('user_media', ['user_uuid' => $user->uuid, 'banner_id' => $banner->id]);
});