<?php

namespace App\Http\Controllers\Settings\Appearance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ColourSchemeController extends Controller
{
    public function update() {
        request()->validate([
            'selectedColourScheme' => ['required']
        ]);
        auth()->user()->changeColourScheme(request('selectedColourScheme'));
        return redirect()->back();
    }
}
