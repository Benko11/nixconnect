<?php

namespace App\Http\Controllers;

use App\Models\Fork;
use App\Models\Post;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class PostController extends Controller
{
    public function show(Post $post) {
        if (!auth()->user()->owns($post)) {
            abort(Response::HTTP_FORBIDDEN);
        }
        
        return Inertia::render('Post/PostShow', ['post' => $post]);
    }

    public function delete(Post $post) {
        if (!auth()->user()->owns($post))
            abort(Response::HTTP_FORBIDDEN);

        $post->fullDelete();
    }

    public function ping(Post $post) {
        $post->ping();
    }

    public function unping(Post $post) {
        $post->unping();
    }

    public function fork(Post $post) {
        request()->validate([
            'description' => ['nullable', 'max:5000']
        ]);

        $post->fork(request('description'));
    }


    public function deleteFork($id) {
        if (Fork::find($id)->user_uuid != auth()->id()) {
            abort(Response::HTTP_FORBIDDEN);
        }

        Fork::find($id)->delete();

        return redirect()->back();
    }
}
