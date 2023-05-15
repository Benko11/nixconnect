<?php

use App\Models\User;
use App\Models\UserAvatar;

uses(Tests\TestCase::class);

it('belongs to a user', function() {
    $user = User::factory()->create();
    $user->addAvatar('avatar.png');
    $this->assertInstanceOf(User::class, UserAvatar::first()->user);
});