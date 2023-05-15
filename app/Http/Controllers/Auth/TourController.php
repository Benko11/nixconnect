<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TourController extends Controller
{
    public function start() {
        return Inertia::render('Auth/Tour/Tour');
    }

    public function finish() {
        auth()->user()->completeTour();

        return redirect('/');
    }
}
