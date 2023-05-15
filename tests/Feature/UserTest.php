<?php

use App\Models\Gender;
use App\Models\Pronoun;
use App\Models\User;
use Database\Seeders\PronounSeeder;
use Illuminate\Support\Facades\Hash;

it('creates a user', function() {
    (new PronounSeeder())->run();

    $hashed = Hash::make('password');
    $user = User::factory()->unverified()->raw(['remember_token' => null, 'password' => $hashed]);

    $this->post('/register', [
        'firstName' => $user['first_name'],
        'lastName' => $user['last_name'],
        'nickname' => $user['nickname'],
        'password' => $hashed,
        'date_of_birth' => '1959-01-01',
        'password_confirmation' => $hashed,
        'email' => $user['email'],
        'genders' => [false, false, false, false, false, false, false],
        'pronouns' => [true, false, false, false, false, false],
        'policies' => true,
    ])->assertRedirect('/home');

    $this->assertDatabaseHas('users', [
        'first_name' => $user['first_name'],
        'last_name' => $user['last_name'],
        'email' => $user['email'],
        // 'date_of_birth' => '1959-01-01'
    ]);

    $this->assertDatabaseHas('user_media', ['user_uuid' => User::first()->uuid]);
});

it('cannot create a user without accepting mandatory fields', function() {
    $hashed = Hash::make('password');

    // for some reason, bad requests are served with 302, instead of 400
    $this->post('register', [])->assertStatus(302);
    $this->post('/register', ['pronouns' => [true]])->assertStatus(302);
    $this->post('/register', ['nickname' => $this->faker->word, 'pronouns' => [true]])->assertStatus(302);
    $this->post('/register', ['nickname' => $this->faker->word, 'pronouns' => [true], 'password' => $hashed, 'password_confirmation' => $hashed])->assertStatus(302);
});

it('can add genders to a user', function() {
    $user = User::factory()->create();
    Gender::insert([
        ['name' => 'Non-binary'],
        ['name' => 'Gender non-conforming'],
        ['name' => 'Male'],
    ]);
    
    foreach (Gender::get()->pluck('id') as $gender) {
        $user->genders()->attach($gender);
        $this->assertDatabaseHas('gender_user', [
            'gender_id' => $gender,
            'user_uuid' => $user->uuid
        ]);
    }
});

it('can add pronouns to a user', function() {
    $user = User::factory()->create();
    Pronoun::insert([
        ['word' => 'he'],
        ['word' => 'they'],
    ]);

    foreach (Pronoun::pluck('id') as $pronoun) {
        $user->pronouns()->attach($pronoun);
        $this->assertDatabaseHas('pronoun_user', [
            'pronoun_id' => $pronoun,
            'user_uuid' => $user->uuid
        ]);
    }
});