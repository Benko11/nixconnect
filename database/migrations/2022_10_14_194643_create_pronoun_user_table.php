<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pronoun_user', function (Blueprint $table) {
            $table->foreignId('pronoun_id')->references('id')->on('pronouns');
            $table->foreignUuid('user_uuid')->references('uuid')->on('users');

            $table->primary(['pronoun_id', 'user_uuid']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pronoun_user');
    }
};
