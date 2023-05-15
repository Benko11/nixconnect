<?php

namespace App\Http\Controllers\Post;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function store() {
        request()->validate([
            'images' => ['required', 'array', 'min:1'],
            'images.*.file' => ['required', 'max:' . config('app.gallery_image_max_size'), 'mimes:jpeg,png,gif,avif,webp'],
            'contents' => ['nullable', 'max:5000'],
            'descriptions.*' => ['nullable', 'max:255']
        ], [
            'images.*.max' => 'The image must not be greater than 5 MB',
            'images.*.mimes' => 'The image must be of type JPG/PNG/GIF/AVIF/WEBP',
        ]);

        $images = $this->upload(request()->file('images'));

        auth()->user()->addGalleryPost($images, request()->get('contents'));

        return redirect()->back();
    }

    public function update(Post $post) {
        request()->validate([
            'contents' => ['nullable', 'max:5000'],
            'descriptions.*' => ['nullable', 'max:255']
        ]);

        auth()->user()->updateGalleryPost($post, request('media'), request('contents'));

        return redirect()->back();
    }

    public function upload($files) {
        $images = [];
        foreach ($files as $key => $file) {
            $file = $file['file'];
            $file->store('posts');
            $images[$file->hashName()] = request()->get('images')[$key];
        }

        return $images;
    }
}
