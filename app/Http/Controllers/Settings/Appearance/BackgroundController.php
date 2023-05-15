<?php

namespace App\Http\Controllers\Settings\Appearance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BackgroundController extends Controller
{
    public function update() {
        request()->validate([
            'background' => ['required']
        ]);

        auth()->user()->changeBackground(request('background'));

        return redirect()->back();
    }
}
