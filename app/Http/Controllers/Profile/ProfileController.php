<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\Fact;
use App\Models\Fork;
use App\Models\User;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function indexMe() {
        $posts = auth()->user()->posts()->latest()->get()->load('pings');
        $forks = Fork::where('user_uuid', auth()->id())->get();
        $temp = $posts->concat($forks)->sortByDesc('created_at');

        $aggregate = [];
        foreach ($temp as $item) {
            $aggregate[] = $item;
        }
        $aggregate = collect($aggregate);
        unset($temp);

        $categories = Fact::all();
        $userFacts = auth()->user()->facts;
        $avatar = auth()->user()->media()->first()->avatar;
        $banner = auth()->user()->media()->first()->banner;

        return Inertia::render('Profile/Profile', [
            'media' => auth()->user()->media,
            'user' => User::with(['pronouns', 'genders'])->find(auth()->id()),
            'posts' => $aggregate->toArray(),
            'stashes' => auth()->user()->load('stashes')->stashes,
            'categories' => $categories,
            'userFacts' => $userFacts,
            'avatar' => $avatar,
            'banner' => $banner,
            'isPrivate' => auth()->user()->isPrivate(),
        ]);
    }

    public function getPosts(User $user) {
        if ($user->isPrivate()) {
            if (!auth()->user()->follows($user)) {
                return [];
            }

            if (!$user->approves(auth()->user())) {
                return [];
            }
        }

        return $user->posts()->latest()->get();
    }

    public function index(User $user) {
        $posts = $this->getPosts($user);
        $userFacts = $user->facts;
        $avatar = $user->media()->first()->avatar;
        $banner = $user->media()->first()->banner;

        return Inertia::render('Profile/Profile', [
            'media' => $user->media,
            'user' => $user->with('genders', 'pronouns')->find($user->uuid),
            'followers' => $user->followers,
            'stashes' => $user->load('stashes')->stashes,
            'posts' => count($posts) == 0 ? [] : $posts->load('pings'),
            'userFacts' => $userFacts,
            'avatar' => $avatar,
            'banner' => $banner,
            'isPrivate' => $user->isPrivate(),
        ]);
    }

    public function follow(User $user) {
        if ($user->isPrivate())
            auth()->user()->follow($user, false);
        else
            auth()->user()->follow($user);

        return redirect()->back();
    }

    public function unfollow(User $user) {
        auth()->user()->unfollow($user);

        return redirect()->back();
    }
}
