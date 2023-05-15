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
        Schema::create('follower_user', function (Blueprint $table) {
            $table->foreignUuid('user_uuid')->references('uuid')->on('users');
            $table->foreignUuid('follower_uuid')->references('uuid')->on('users');
            $table->boolean('approved')->default(true);

            $table->primary(['user_uuid', 'follower_uuid']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('follower_user');
    }
};
