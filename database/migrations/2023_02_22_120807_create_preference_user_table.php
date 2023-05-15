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
        Schema::create('preference_user', function (Blueprint $table) {
            $table->foreignId('preference_id')->references('id')->on('preferences');
            $table->foreignUuid('user_uuid')->references('uuid')->on('users');
            $table->bigInteger('value');
            $table->primary(['preference_id', 'user_uuid']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('preference_user');
    }
};
