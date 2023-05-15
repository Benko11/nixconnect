<?php

namespace Database\Seeders;

use App\Models\ColourScheme;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ColourSchemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $themes = [
            [
                'name' => 'Default',
                'primary' => 'hsl(220, 70%, 70%)',
                'secondary' => 'hsl(12, 80%, 27%)',
                'tertiary' => 'hsl(0, 0%, 20%)',
                'quaternary' => 'hsl(300, 80%, 30%)',
                'error' => 'hsl(60, 100%, 50%)',
                'foreground' => 'hsl(220, 5%, 90%)',
                'foreground_dark' => 'hsl(220, 5%, 10%)'
            ],
            [
                'name' => 'Synthwave',
                'primary' => '#C724B1',
                'secondary' => '#642F6C',
                'tertiary' => 'hsl(0, 0%, 20%)',
                'quaternary' => '#58A7AF',
                'error' => '#71DBD4',
                'foreground' => '#F3E9F4',
                'foreground_dark' => '#3A3A59'
            ],
            [
                'name' => 'MS-DOS',
                'primary'=> '#00FFFF',
                'secondary' => '#800000',
                'tertiary' => '#606060',
                'quaternary' => '#008000',
                'error' => '#FF0000',
                'foreground' => '#FFFFFF',
                'foreground_dark' => '#000000'
            ],
            [
                'name' => 'ZX Spectrum',
                'primary' => '#0E0',
                'secondary' => '#00E',
                'tertiary' => '#212121',
                'quaternary' => '#E00',
                'error' => '#EE0',
                'foreground' => '#EEE',
                'foreground_dark' => '#000'
            ],
            [
                'name' => 'Amiga Workbench',
                'primary' => '#FF8800',
                'secondary' => '#0057AF',
                'tertiary' => '#222025',
                'quaternary' => '#B52F2A',
                'error' => '#F5CEAD',
                'foreground' => '#FFFFFF',
                'foreground_dark' => '#000'
            ],
            [
                'name' => 'Neon',
                'primary' => '#2AD2C9',
                'secondary' => '#80b00c',
                'tertiary' => '#3a373f',
                'quaternary' => '#F000FF',
                'error' => '#FFE700',
                'foreground' => '#eeffee',
                'foreground_dark' => '#171118'
            ]
        ];

        DB::transaction(function () use ($themes) {
            foreach ($themes as $theme) {
                ColourScheme::create($theme);
            }
        });
    }
}
