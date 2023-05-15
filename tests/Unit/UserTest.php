<?php

use App\Models\Gender;
use App\Models\Preference;
use App\Models\User;
use App\Models\Pronoun;
use Database\Seeders\PreferencesSeeder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Schema;
use Psy\Readline\Hoa\Console;

uses(Tests\TestCase::class);

it('belongs to many genders', function() {
    $user = User::factory()->create();
    $gender = Gender::create(['name' => 'Male']);

    $this->assertInstanceOf(Collection::class, $user->genders);

    $user->genders()->attach($gender->id);
    $this->assertDatabaseHas('gender_user', ['user_uuid' => $user->uuid, 'gender_id' => $gender->id]);
});

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

it('belongs to many followers', function() {
    $user = User::factory()->create();
    $follower1 = User::factory()->create();
    $follower2 = User::factory()->create();
    $follower3 = User::factory()->create();

    $user->followers()->attach($follower1->uuid);
    $user->followers()->attach($follower2->uuid);
    $user->followers()->attach($follower3->uuid);

    $follower1->followers()->attach($user->uuid);

    $this->assertDatabaseHas('follower_user', [
        'user_uuid' => $user->uuid,
        'follower_uuid' => $follower1->uuid
    ]);

    $this->assertDatabaseHas('follower_user', [
        'user_uuid' => $user->uuid,
        'follower_uuid' => $follower2->uuid
    ]);

    $this->assertDatabaseHas('follower_user', [
        'user_uuid' => $user->uuid,
        'follower_uuid' => $follower3->uuid
    ]);

    $this->assertDatabaseHas('follower_user', [
        'user_uuid' => $follower1->uuid,
        'follower_uuid' => $user->uuid
    ]);
});

it('has many hashtags', function() {
    $user = User::factory()->create();
    $this->assertInstanceOf(Collection::class, $user->hashtags);
});

it('can be soft deleted', function() {
    $this->assertTrue(Schema::hasColumn('users', 'deleted_at'));
});

it('can be set to private', function() {
    (new PreferencesSeeder())->run();
    $preferences = Preference::all();

    $user = User::factory()->create();
    foreach ($preferences as $preference) {
        $user->preferences()->attach($preference, ['value' => $preference->default]);
    }
    $user->togglePrivate();

    $privatePreference = Preference::where('slug', 'private-profile')->firstOrFail();

    $this->assertDatabaseHas('preference_user', ['preference_id' => $privatePreference->id, 'user_uuid' => $user->uuid, 'value' => 1]);
    $this->assertTrue($user->isPrivate());
});