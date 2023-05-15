<?php

namespace Database\Seeders;

use App\Models\Gender;
use App\Models\Preference;
use App\Models\Pronoun;
use App\Models\User;
use App\Models\UserMedium;
use Illuminate\Database\Seeder;

define('ONE_GENDER_THRESHOLD', 80);
define('TWO_GENDERS_THRESHOLD', 95);

define('ONE_PRONOUN_THRESHOLD', 80);
define('TWO_PRONOUNS_THRESHOLD', 95);

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::factory()->count(100)->create();

        $users = User::all();
        foreach ($users as $user) {
            $this->addMedia($user);
            $this->addPreferences($user);
            $this->addGenders($user);
            $this->addPronouns($user);
        }

        $this->createAdmin();
    }

    public function addPreferences($user) {
        $preferences = Preference::all();

        foreach ($preferences as $preference) {
            $user->preferences()->attach($preference, ['value' => $preference->default]);
        }
    }

    public function addGenders($user) {
        $randomizer = mt_rand(0, 100);

        $prototypeGender = Gender::inRandomOrder();

        if ($randomizer < ONE_GENDER_THRESHOLD) {
            $genders = $prototypeGender->orderBy('id', 'asc')->take(1)->pluck('id')->toArray();
        } else if ($randomizer < TWO_GENDERS_THRESHOLD) {
            $genders = $prototypeGender->orderBy('id', 'asc')->take(2)->pluck('id')->toArray();
        } else {
            $genders = $prototypeGender->orderBy('id', 'asc')->take(3)->pluck('id')->toArray();
        }

        $user->addGenders($genders);
    }

    public function addPronouns($user) {
        $randomizer = mt_rand(0, 100);

        $prototypePronoun = Pronoun::inRandomOrder();

        if ($randomizer < ONE_PRONOUN_THRESHOLD) {
            $pronouns = $prototypePronoun->orderBy('id', 'asc')->take(2)->pluck('id')->toArray();
        } else if ($randomizer < TWO_PRONOUNS_THRESHOLD) {
            $pronouns = $prototypePronoun->orderBy('id', 'asc')->take(3)->pluck('id')->toArray();
        } else {
            $pronouns = $prototypePronoun->orderBy('id', 'asc')->take(4)->pluck('id')->toArray();
        }

        $user->addPronouns($pronouns);
    }

    public function createAdmin() {
        $admin = new User([
            'nickname' => 'benko11',
            'first_name' => 'Benjamin',
            'last_name' => 'Bergstrom',
            'email' => 'benko.bergstrom@outlook.com',
            'email_verified_at' => now(),
            'password' => 'maelstrom',
            'bio' => 'I am autistic, looooool',
            'date_of_birth' => '1998-10-15'
        ]);
        $admin->save();
        $admin->addGender(3);
        $admin->addPronouns([1, 5]);

        $this->addMedia($admin);
        $this->addPreferences($admin);
    }

    public function addMedia($user) {
        $user->media()->save(new UserMedium);
    }
}
