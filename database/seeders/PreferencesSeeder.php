<?php

namespace Database\Seeders;

use App\Models\Preference;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PreferencesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $preferences = [
            [
                'title' => 'Colour scheme',
                'slug' => 'colour-scheme',
                'default' => 1
            ],
            [
                'title' => 'Max post size',
                'slug' => 'max-post-size',
                'default' => 600
            ],
            [
                'title' => 'Font family',
                'slug' => 'font-family',
                'default' => 1
            ],
            [
                'title' => 'Font size',
                'slug' => 'font-size',
                'default' => 16
            ],
            [
                'title' => 'Background',
                'slug' => 'background',
                'default' => 723982
            ],
            [
                'title' => 'Private profile',
                'slug' => 'private-profile',
                'default' => 0
            ],
            [
                'title' => 'Line height',
                'slug' => 'line-height',
                'default' => 140
            ],
            [
                'title' => 'Flash message side',
                'slug' => 'flash-message-side',
                'default' => 1
            ],
            [
                'title' => 'Flash message length',
                'slug' => 'flash-message-length',
                'default' => 5000   
            ],
            [
                'title' => 'Display email',
                'slug' => 'display-email',
                'default' => 0
            ],
            [
                'title' => 'Display date of birth',
                'slug' => 'display-date-of-birth',
                'default' => 0
            ],
        ];

        foreach ($preferences as $preference) {
            (new Preference($preference))->save();
        }
    }
}
