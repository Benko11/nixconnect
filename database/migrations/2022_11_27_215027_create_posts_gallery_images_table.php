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
        Schema::create('posts_gallery_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_gallery_id')->references('id')->on('posts_gallery')->onCascade('delete');
            $table->string('file_name');
            $table->string('description')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts_gallery_images');
    }
};
