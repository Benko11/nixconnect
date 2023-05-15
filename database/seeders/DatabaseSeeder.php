<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ColourSchemeSeeder::class);
        $this->call(GenderSeeder::class);
        $this->call(PronounSeeder::class);
        $this->call(FontSeeder::class);
        $this->call(CodeLanguageSeeder::class);
        $this->call(PreferencesSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(PostsSeeder::class);
    }
}
