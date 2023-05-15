<?php

namespace Database\Seeders;

use App\Models\Gender;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GenderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $genders = ['Male', 'Female', 'Non-binary', 'Genderqueer', 'Gender non-conforming', 'Intersex', 'Genderfluid', 'Prefer not to say'];
        foreach ($genders as $gender) {
            Gender::create(['name' => $gender]);
        }
    }
}
