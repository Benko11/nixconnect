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
        Schema::create('fact_user', function (Blueprint $table) {
            $table->foreignUuid('user_uuid')->references('uuid')->on('users');
            $table->foreignId('fact_id')->references('id')->on('facts');
            $table->string('value');

            $table->primary(['user_uuid', 'fact_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fact_user');
    }
};
