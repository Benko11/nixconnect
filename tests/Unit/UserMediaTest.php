<?php

use App\Models\User;
use App\Models\UserMedium;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Schema;

uses(Tests\TestCase::class);

it('has a relationship with user for the media', function() {
    $user = User::factory()->create();
    $user->media()->save(new UserMedium());

    $this->assertInstanceOf(UserMedium::class, $user->media);
});


it('has a relation with media for the user', function() {
    $user = User::factory()->create();

    $user->media()->save(new UserMedium());

    $this->assertInstanceOf(User::class, UserMedium::first()->user);
});

it('has many avatars', function() {
    $user = User::factory()->create();
    $this->assertInstanceOf(Collection::class, $user->avatars);
}); 
