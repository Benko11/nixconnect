<?php

namespace App\Http\Controllers\Post;

use App\Http\Controllers\Controller;
use App\Models\CodeLanguage;
use App\Models\Post;
use Illuminate\Http\Request;

class CodeController extends Controller
{
    public function store() {
        $langs = implode(',', CodeLanguage::pluck('slug')->toArray());

        request()->validate([
            'language' => ['required', 'in:'.$langs],
            'code' => ['required'],
            'description' => ['required', 'max:5000']
        ]);

        $languageId = CodeLanguage::where('slug', request('language'))->pluck('id')[0];
        auth()->user()->addCodePost(request()->get('code'), $languageId, request('description'));

        return redirect()->back();
    }

    public function update(Post $post) {
        request()->validate([
            'code' => ['required'],
            'contents' => ['required', 'max:5000']
        ]);

        auth()->user()->updateCodePost($post, request('code'), request('contents'));

        return redirect()->back();
    }
}
