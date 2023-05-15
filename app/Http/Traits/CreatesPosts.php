<?php

namespace App\Http\Traits;

use App\Models\Post;
use App\Models\PostTypes\Article;
use App\Models\PostTypes\Code;
use App\Models\PostTypes\Gallery;
use App\Models\PostTypes\Text;
use Symfony\Component\HttpFoundation\Response;

trait CreatesPosts {
    public function posts() {
        return $this->hasMany(Post::class);
    }
    
    public function addTextPost(string $contents) {
        $post = Text::create(['contents' => $contents]);
        $this->posts()->save(new Post(['postable_type' => 'text', 'postable_id' => $post->id]));
    }

    public function updateTextPost(Post $post, string $contents) {
        if (!auth()->user()->owns($post))
            abort(Response::HTTP_FORBIDDEN);

        $post->postable->contents = $contents;
        $post->postable->save();
        $post->touch();
    }

    public function addGalleryPost(iterable $images, string $description = null) {
        $post = Gallery::create(['contents' => $description]);

        foreach ($images as $fileName => $contents) {
            $text = null;
            if (!is_int($contents['description'])) {
                $text = $contents['description'];
            }

            $post->addImage($fileName, $text);
        }

        $this->posts()->save(new Post(['postable_type' => 'gallery', 'postable_id' => $post->id]));
    }

    public function updateGalleryPost(Post $post, iterable $images, string $description) {
        if (!auth()->user()->owns($post))
            abort(Response::HTTP_FORBIDDEN);

        $i = 0;
        foreach ($post->postable->images as $image) {
            $image->description = $images[$i++]['description'];
            $image->save();
        }
        
        $post->postable->contents = $description;
        $post->postable->save();
        $post->touch();
    }

    public function addCodePost(string $code, int $languageId, string $description = null) {
        $post = Code::create(['description' => $description, 'code' => $code, 'code_language_id' => $languageId]);
        $this->posts()->save(new Post(['postable_type' => 'code', 'postable_id' => $post->id]));
    }

    public function updateCodePost(Post $post, string $code, string $description) {
        if (!auth()->user()->owns($post))
            abort(Response::HTTP_FORBIDDEN);

        $post->postable->code = $code;
        $post->postable->description = $description;
        $post->postable->save();
        $post->touch();
    }

    public function addArticle(string $title, string $body, int $fontId = null) {
        $post = Article::create(['title' => $title, 'body' => $body]);
        $this->posts()->save(new Post(['postable_type' => 'article', 'postable_id' => $post->id]));
    }

    
    public function updateArticlePost(Post $post, string $title, string $body) {
        if (!auth()->user()->owns($post))
            abort(Response::HTTP_FORBIDDEN);

        $post->postable->title = $title;
        $post->postable->body = $body;
        $post->postable->save();
        $post->touch();
    }

    public function owns(Post $post) {
        return $this->uuid == $post->user_uuid;
    }
}