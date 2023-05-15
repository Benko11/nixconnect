<?php

use App\Models\Fact;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

uses(Tests\TestCase::class);

test('user belongs to many facts', function() {
    $user = User::factory()->create();

    $this->assertInstanceOf(Collection::class, $user->facts);
});

test('fact belongs to many users', function() {
    $fact = new Fact(['category' => 'Favourite band']);
    $fact->save();

    $this->assertInstanceOf(Collection::class, $fact->users);
});