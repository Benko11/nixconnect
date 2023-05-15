<?php

namespace App\Http\Controllers\Settings\Appearance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MaxSizeController extends Controller
{
    public function update() {
        request()->validate([
            'maxArticleSize' => ['required', 'numeric', 'gte:0']
        ]);

        auth()->user()->changeMaxPostSize(request('maxArticleSize'));
        return redirect()->back();
    }
}
