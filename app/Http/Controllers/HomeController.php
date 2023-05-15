<?php

namespace App\Http\Controllers;

use App\Models\CodeLanguage;
use App\Models\Fork;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke()
    {
        $followingIds = auth()->user()->following()->where('approved', true)->pluck('uuid')->toArray();
        $followingIds[] = auth()->id();
        $posts = Post::latest()->whereIn('user_uuid', $followingIds)->get();
        $forks = Fork::whereIn('user_uuid', $followingIds)->get();
        $codeLanguages = CodeLanguage::get();

        $temp = $posts->concat($forks)->sortByDesc('created_at');

        $aggregate = [];
        foreach ($temp as $item) {
            $aggregate[] = $item;
        }
        $aggregate = collect($aggregate);
        unset($temp);

        return Inertia::render('Home/Home', [
            'posts' => $aggregate->toArray(),
            'codeLanguages' => $codeLanguages
        ]);
    }
}
