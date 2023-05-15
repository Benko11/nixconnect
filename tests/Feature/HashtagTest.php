<?php

use App\Models\User;

it('can start a new hashtag', function () {
    $hashtag = 'gravityfalls';
    $user = User::factory()->create();
    
    $user->addHashtag($hashtag);

    $this->assertDatabaseHas('hashtags', [
        'name' => $hashtag,
        'author_uuid' => $user->uuid
    ]);
});
