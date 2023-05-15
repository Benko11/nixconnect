<?php

namespace Tests\Feature\Auth;

use App\Providers\RouteServiceProvider;
use Database\Seeders\PronounSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register()
    {
        (new PronounSeeder())->run();

        $response = $this->post('/register', [
            'nickname' => 'uwu',
            'password' => 'password',
            'password_confirmation' => 'password',
            'pronouns' => [true, false, false, false, false, false, false],
            'genders' => [],
            'policies' => true
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(RouteServiceProvider::HOME);
    }
}
