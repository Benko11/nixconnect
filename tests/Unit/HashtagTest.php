<?php

use App\Models\Hashtag;
use App\Models\User;

uses(Tests\TestCase::class);

it('belongs to a user', function () {
    $user = User::factory()->create();
    $user->addHashtag('gravityfalls');
    $this->assertInstanceOf(User::class, Hashtag::first()->author);
});
