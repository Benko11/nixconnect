<?php

namespace App\Http\Controllers;

use App\Models\Fork;
use App\Models\Post;
use Inertia\Inertia;

class StashController extends Controller
{
    public function index() {
        $resources = collect();
        $stashes = auth()->user()->stashes;

        foreach ($stashes as $stash) {
            $id = $stash->stashable_id;
            $type = $stash->stashable_type;

            if ($type == 'post') {
                $resources->push(Post::find($id));
                continue;
            }

            $resources->push(Fork::find($id));
        }

        return Inertia::render('Stash', [
            'stashes' => auth()->user()->stashes,
            'resources' => $resources
        ]);
    }
    
    public function store($type, $id) {
        $resource = $type == 'post' ? Post::find($id) : Fork::find($id);
        auth()->user()->stash($resource);

        return redirect()->back();
    }
    
    public function delete($type, $id) {
        $resource = $type == 'post' ? Post::find($id) : Fork::find($id);

        auth()->user()->unstash($resource);

        return redirect()->back();
    }
}
