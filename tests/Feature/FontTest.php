<?php

use App\Models\Font;

it('has fonts', function () {
    $fonts = [
        ['name' => 'Perfect DOS VGA 437 Win', 'url' => 'Perfect_DOS_VGA_437_Win.ttf', 'type' => 'monospace'],
    ];

    foreach ($fonts as $font) { 
        Font::create($font);
        $this->assertDatabaseHas('fonts', $font);
    }
});
