<?php

namespace Database\Seeders;

use App\Models\Pronoun;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PronounSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $pronouns = ['he', 'him', 'she', 'her', 'they', 'them'];
        foreach ($pronouns as $pronoun) {
            Pronoun::create(['word' => $pronoun]);
        }
    }
}
