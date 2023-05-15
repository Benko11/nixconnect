<?php

use App\Models\CodeLanguage;
use App\Models\Post;
use App\Models\PostTypes\Article;
use App\Models\PostTypes\Code;
use App\Models\PostTypes\Text;
use App\Models\PostTypes\Gallery;
use App\Models\PostTypes\GalleryImage;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

uses(Tests\TestCase::class);

test('post has exactly one postable text counterpart', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $user->addTextPost('');
    $post = Post::first();

    $this->assertInstanceOf(Text::class, $post->postable);
});

test('post belongs to an owner', function() {
    $user = User::factory()->create();
    $this->actingAs($user);

    $user->addTextPost('');
    $post = Post::first();

    $this->assertInstanceOf(User::class, $post->owner);
});

test('postable is assigned to a post', function() {
    $user = User::factory()->create();
    $this->actingAs($user);

    $user->addTextPost('');
    $textPost = Text::first();

    $this->assertInstanceOf(Post::class, $textPost->post);
});

test('post has exactly one postable gallery counterpart', function() {
    $user = User::factory()->create();
    $this->actingAs($user);

    $user->addGalleryPost(['image.png' => ['description' => null]]);
    $post = Post::first();

    $this->assertInstanceOf(Gallery::class, $post->postable);
});

test('post gallery has many images', function() {
    $user = User::factory()->create();
    $this->actingAs($user);

    $user->addGalleryPost(['image.png' => ['description' => null], 'image2.png' => ['description' => null]]);
    $post = Post::first();

    $this->assertInstanceOf(Collection::class, $post->postable->images);
});

test('post gallery image belongs to a gallery post', function() {
    $user = User::factory()->create();
    $this->actingAs($user);

    $user->addGalleryPost(['image.png' => ['description' => null]]);

    $stub = GalleryImage::first();

    $this->assertInstanceOf(Gallery::class, $stub->postGallery);
});

test('post has exactly one postable code counterpart', function() {
    $user = User::factory()->create();
    $this->actingAs($user);

    CodeLanguage::create(['name' => 'C', 'slug' => 'c']);
    $language = CodeLanguage::first();

    $code = <<<END
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    printf("93pigeons\n");
    return EXIT_SUCCESS;
}
END;
    $user->addCodePost($code, $language->id);
    $post = Post::first();

    $this->assertInstanceOf(Code::class, $post->postable);
});

test('post has exactly one postable article counterpart', function() {
    $user = User::factory()->create();
    $this->actingAs($user);

    $title = 'My First Article';
    $body = <<<UWU
It is time to get started working on some great stuff.

# Great Stuff

I have a mouse on a mouse pad. Imagine some more text.

![My Image](https://gitea.com/benko11/wallpapers/raw/branch/main/The%20Loud%20House/S5E19A_What_are_we_gonna_do%20.png)

See ya,
Benjamin
UWU;

    $user->addArticle($title, $body);

    $post = Post::first();

    $this->assertInstanceOf(Article::class, $post->postable);
});