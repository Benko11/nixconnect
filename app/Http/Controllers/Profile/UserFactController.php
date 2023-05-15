<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\Fact;
use Illuminate\Http\Request;

class UserFactController extends Controller
{
    public function store() {
        request()->validate([
            'category' => ['required', 'max:255'],
            'value' => ['required', 'max:255']
        ]);

        auth()->user()->addFact([request('category'), request('value')]);

        return redirect()->back();
    }
}
