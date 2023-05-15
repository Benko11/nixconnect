<?php

use App\Models\Gender;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

uses(Tests\TestCase::class);

it('belongs to many users', function() {
    $user = User::factory()->create();
    $this->actingAs($user);

    $gender = Gender::create(['name' => 'Male']);
    
    $this->assertInstanceOf(Collection::class, $gender->users);
    
    $gender->users()->attach($user->uuid);
    $this->assertDatabaseHas('gender_user', ['user_uuid' => $user->uuid, 'gender_id' => $gender->id]);
});