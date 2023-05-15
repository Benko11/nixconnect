<?php

use App\Models\User;

it('adds facts for the user', function() {
    $this->withoutExceptionHandling();
    
    $facts = ['Favourite band' => 'Radiohead', 'Favourite colour' => 'Nebula Blue', 'Cartoon Character' => 'SpongeBob Squarepants', 'Religion' => '(none)'];
    $user = User::factory()->create();
    
    foreach ($facts as $category => $value) {
        $user->addFact(array($category, $value));

        $this->assertDatabaseHas('fact_user', [
            'user_uuid' => $user->uuid,
            'value' => $value
        ]);
    }
});