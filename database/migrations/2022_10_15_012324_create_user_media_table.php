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
        Schema::create('user_media', function (Blueprint $table) {
            $table->foreignUuid('user_uuid')->primary();
            $table->unsignedBigInteger('avatar_id')->nullable();
            $table->unsignedBigInteger('banner_id')->nullable();
            $table->float('banner_pos_x')->default(0.5);
            $table->float('banner_pos_y')->default(0.5);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_media');
    }
};
