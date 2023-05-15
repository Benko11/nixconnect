<?php

namespace App\Http\Controllers\Post;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function store() {
        request()->validate([
            'title' => ['required', 'max:255'],
            'body' => ['required']
        ]);

        auth()->user()->addArticle(request('title'), request('body'));

        return redirect()->back();
    }

    public function update(Post $post) {
        request()->validate([
            'title' => ['required', 'max:255'],
            'contents' => ['required']
        ]);

        auth()->user()->updateArticlePost($post, request('title'), request('contents'));

        return redirect()->back();
    }
}
