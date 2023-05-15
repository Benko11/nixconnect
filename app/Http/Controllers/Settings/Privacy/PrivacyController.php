<?php

namespace App\Http\Controllers\Settings\Privacy;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class PrivacyController extends Controller
{
    public function show() {
        $approveRequests = auth()->user()->followers()->where('approved', false)->get();
        return Inertia::render('Settings/Privacy/Privacy', ['approveRequests' => $approveRequests]);
    }

    public function toggleVisibility() {
        auth()->user()->togglePrivate();

        foreach (auth()->user()->followers as $follower) {
            auth()->user()->followers()->syncWithoutDetaching([
                $follower->uuid => ['approved' => !auth()->user()->isPrivate()
            ]]);
        }

        return redirect()->back();
    }

    public function approveFollow() {
        auth()->user()->approve(User::find(request('approveUser')));

        return redirect()->back();
    }

    public function toggleDisplayed() {
        auth()->user()->toggleDisplayed(request('email'), request('dateOfBirth'));
    }
}
