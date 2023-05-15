<?php

namespace App\Http\Controllers\Settings\Appearance;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FlashMessageController extends Controller
{
    public function update() {
        request()->validate([
            'flashMessageSide' => ['required', 'in:0,1'],
            'flashMessageLength' => ['required', 'gte:0']
        ]);

        auth()->user()->changeFlashMessage(request('flashMessageSide'), request('flashMessageLength'));

        return redirect()->back();
    }
}
