<?php

use App\Models\User;
use App\Models\Pronoun;
use Illuminate\Database\Eloquent\Collection;

uses(Tests\TestCase::class);

it('belongs to many pronouns', function() {
    $user = User::factory()->create();
    $this->assertInstanceOf(Collection::class, $user->pronouns);

    $pronoun = Pronoun::create(['word' => 'he']);
    $user->pronouns()->attach($pronoun->id);

    $this->assertDatabaseHas('pronoun_user', [
        'pronoun_id' => $pronoun->id,
        'user_uuid' => $user->uuid
    ]);
});
