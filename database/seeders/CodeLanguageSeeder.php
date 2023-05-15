<?php

namespace Database\Seeders;

use App\Models\CodeLanguage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CodeLanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $languages = [
            'C' => 'c',
            'C++' => 'cpp',
            'PHP' => 'php',
            'JavaScript' => 'javascript',
            'Java' => 'java',
            'Python' => 'python',
            'TypeScript' => 'typescript',
            'Rust' => 'rust'
        ];

        foreach ($languages as $language => $slug) {
            CodeLanguage::create(['name' => $language, 'slug' => $slug]);
        }
    }
}
