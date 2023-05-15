<?php

namespace App\Http\Controllers\Settings\Media;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function show() {
        return Inertia::render('Settings/Media/Media', [
            'avatars' => auth()->user()->avatars,
            'banners' => auth()->user()->banners,
            'media' => auth()->user()->media
        ]);
    }
}
