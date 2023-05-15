<?php

namespace App\Http\Controllers\Post;

use App\Http\Controllers\Controller;
use App\Models\Post;

class TextController extends Controller
{
    public function store() {
        request()->validate([
            'message' => ['required']
        ], [
            'message.required' => 'Please type in the message'
        ]);

        auth()->user()->addTextPost(request('message'));

        return redirect()->back();
    }

    public function update(Post $post) {
        request()->validate([
            'contents' => ['required'],
        ], [
            'contents.required' => 'Please type in the message'
        ]);

        auth()->user()->updateTextPost($post, request('contents'));

        return redirect()->back();
    }
}
