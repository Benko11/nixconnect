<?php

namespace App\Http\Controllers\Settings\Appearance;

use App\Http\Controllers\Controller;
use App\Models\ColourScheme;
use App\Models\Font;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppearanceController extends Controller
{
    public function show() {
        return Inertia::render('Settings/Looks/Looks');
    }
}
