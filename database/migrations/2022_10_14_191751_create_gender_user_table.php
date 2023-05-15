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
        Schema::create('gender_user', function (Blueprint $table) {
            $table->foreignId('gender_id')->references('id')->on('genders');
            $table->foreignUuid('user_uuid')->references('uuid')->on('users');

            $table->primary(['gender_id', 'user_uuid']);

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gender_user');
    }
};
