<?php

use App\Models\User;
use App\Models\UserBanner;
use Illuminate\Database\Eloquent\Collection;

uses(Tests\TestCase::class);

it('belongs to a user', function() {
    $user = User::factory()->create();
    $user->addBanner('banner.png');
    
    $banner = UserBanner::first();
    $this->assertInstanceOf(User::class, $banner->user);
});

it('has many banners', function() {
    $user = User::factory()->create();
    $user->addBanner('banner.png');
    $user->addBanner('banner2.png');

    $this->assertInstanceOf(Collection::class, $user->banners);
});