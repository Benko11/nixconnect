<?php

namespace Database\Seeders;

use App\Models\Font;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FontSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $fonts = [
            ['name' => 'MS-DOS', 'url' => 'Perfect_DOS_VGA_437_Win.ttf', 'type' => 1],
            ['name' => 'Fira Code', 'url' => 'FiraCode-VariableFont_wght.ttf', 'type' => 1],
            ['name' => 'Retro IBM', 'url' => 'Ac437_Acer_VGA_8x8.ttf', 'type' => 1],
            ['name' => 'ZX Spectrum', 'url' => 'zx-spectrum.ttf', 'type' => 1]
            // ['name' => 'IBM Plex Mono', 'type' => 1],
            // ['name' => 'Roboto Mono', 'type' => 1],
            // ['name' => 'Source Code Pro', 'type' => 1],
        ];

        foreach ($fonts as $font) {
            Font::create($font);
        }
    }
}
