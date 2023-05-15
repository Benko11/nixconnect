<?php

use App\Models\CodeLanguage;
use App\Models\User;

it('can create a post of type text', function() {
    $user = User::factory()->create();
    $this->actingAs($user);

    $message = 'Thinking about updating my Arch Linux... Gotta live on the edge!';
    $user->addTextPost($message);

    $this->assertDatabaseHas('posts', ['user_uuid' => $user->uuid, 'postable_type' => 'text', 'postable_id' => 1]);
    $this->assertDatabaseHas('posts_text', ['contents' => $message]);
});

it('can create a post of type gallery without text', function() {
    $user = User::factory()->create();
    $this->actingAs($user);

    $files = ['img1.png' => ['description' => null], 'img2.png' => ['description' => null], 'img3.png' => ['description' => null]];
    $user->addGalleryPost($files);

    $this->assertDatabaseHas('posts', ['user_uuid' => $user->uuid, 'postable_type' => 'gallery', 'postable_id' => 1]);
    $this->assertDatabaseHas('posts_gallery', ['contents' => null]);

    foreach ($files as $fileName => $obj) {
        $this->assertDatabaseHas('posts_gallery_images', ['file_name' => $fileName, 'description' => $obj['description']]);
    }
});

it('can create a gallery with image descriptions', function() {
    $user = User::factory()->create();
    $this->actingAs($user);

    $files = [
        'img1.png' => ['description' => 'This happened when I installed Ubuntu.'],
        'img2.png' => ['description' => 'This is what the terminal looked like.'],
        'img3.png' => ['description' => 'This is what I saw after reboot.']
    ];
    $description = 'Imagine a long story describing a complicated technical issue. This story would be pertinent to installing and trying to configure Ubuntu in a certain way, which I cannot think of off the top of my head.';

    $user->addGalleryPost($files, $description);

    $this->assertDatabaseHas('posts', ['user_uuid' => $user->uuid, 'postable_type' => 'gallery', 'postable_id' => 1]);
    $this->assertDatabaseHas('posts_gallery', ['contents' => $description]);
    
    foreach ($files as $fileName => $obj) {
        $this->assertDatabaseHas('posts_gallery_images', ['file_name' => $fileName, 'description' => $obj['description']]);
    }
});

it('can create a post with C code and no description', function() {
    CodeLanguage::create(['name' => 'C', 'slug' => 'c']);

    $user = User::factory()->create();
    $this->actingAs($user);
    $code = <<<END
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    printf("93pigeons\n");
    return EXIT_SUCCESS;
}
END;

    $language = CodeLanguage::first();
    $user->addCodePost($code, $language->id);

    $this->assertDatabaseHas('posts', ['user_uuid' => $user->uuid, 'postable_type' => 'code', 'postable_id' => 1]);
    $this->assertDatabaseHas('posts_code', ['description' => null, 'code' => $code, 'code_language_id' => 1]);
});

it('can create a post with C code and description', function() {
    CodeLanguage::create(['name' => 'C', 'slug' => 'c']);

    $user = User::factory()->create();
    $this->actingAs($user);
    $code = <<<END
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    printf("93pigeons\n");
    return EXIT_SUCCESS;
}
END;

    $description = 'My first C programme, lol';
    $language = CodeLanguage::first();
    $user->addCodePost($code, $language->id, $description);

    $this->assertDatabaseHas('posts', ['user_uuid' => $user->uuid, 'postable_type' => 'code', 'postable_id' => 1]);
    $this->assertDatabaseHas('posts_code', ['description' => $description, 'code' => $code, 'code_language_id' => 1]);
});

it('can create an article', function() {
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

    $this->assertDatabaseHas('posts', ['user_uuid' => $user->uuid, 'postable_type' => 'article', 'postable_id' => 1]);
    $this->assertDatabaseHas('posts_article', ['title' => $title, 'body' => $body]);
});