<?php

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

uses(Tests\TestCase::class);

it('belongs to many followers', function() {
    $user = User::factory()->create();
    $this->assertInstanceOf(Collection::class, $user->followers);

    $anotherUser = User::factory()->create();
    $user->followers()->attach($anotherUser->uuid);

    $this->assertInstanceOf(Collection::class, $user->followers);
    $this->assertInstanceOf(Collection::class, $anotherUser->followers);
});