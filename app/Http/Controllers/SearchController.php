<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index() {
        return Inertia::render('Search', [
            'recentUsers' => User::latest()->whereNotNull('toured_at')->whereNot('nickname', auth()->user()->nickname)->take(10)->get()
        ]);
    }

    public function search() {
        $results = [];

        $users = User::where('nickname', 'LIKE', '%'. request('query') .'%')
                    ->orWhere(DB::raw('lower(first_name)'), 'LIKE', '%'. request('query').'%')
                    ->orWhere(DB::raw('lower(last_name)'), 'LIKE', '%'. request('query').'%')
                    ->orWhere(DB::raw('lower(bio)'), 'LIKE', '%'. request('query') . '%')->get();


        if ($users->count() > 0) {
            $results['users'] = collect($users);
        }

        return $results;
    }
}
