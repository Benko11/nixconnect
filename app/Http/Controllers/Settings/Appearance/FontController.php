<?php

namespace App\Http\Controllers\Settings\Appearance;

use App\Http\Controllers\Controller;

class FontController extends Controller
{
    public function update() {
        request()->validate([
            'family' => ['required'],
            'size' => ['nullable', 'numeric', 'gte:8', 'lte:64'],
            'lineHeight' => ['nullable', 'gte:50', 'lte:500']
        ]);

        auth()->user()->changeFont(request('family'), request('size') || null, request('lineHeight') || null);

        return redirect()->back();
    }
}
