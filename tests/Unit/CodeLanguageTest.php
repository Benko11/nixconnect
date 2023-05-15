<?php

use App\Models\CodeLanguage;
use App\Models\PostTypes\Code;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

uses(Tests\TestCase::class);

test('code post has code, which belongs to a language', function () {
    CodeLanguage::create(['name' => 'C', 'slug' => 'c']);

    $language = CodeLanguage::first();

    $user = User::factory()->create();
    $this->actingAs($user);
    $code = <<<ABC
#include <stdlib.h>

int main(void) {
    return EXIT_SUCCESS;
}
ABC;

    $user->addCodePost($code, $language->id);
    $codePost = Code::first();
    
    $this->assertInstanceOf(CodeLanguage::class, $codePost->language);
});

test('code language has many posts', function() {
    CodeLanguage::create(['name' => 'C', 'slug' => 'c']);

    $language = CodeLanguage::first();

    $user = User::factory()->create();
    $this->actingAs($user);
    $code = <<<ABC
#include <stdlib.h>

int main(void) {
    return EXIT_SUCCESS;
}
ABC;
    $user->addCodePost($code, $language->id);

    $this->assertInstanceOf(Collection::class, $language->codePosts);
});