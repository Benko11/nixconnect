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
        Schema::create('colour_schemes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('primary');
            $table->string('secondary');
            $table->string('tertiary');
            $table->string('quaternary');
            $table->string('foreground');
            $table->string('foreground_dark');
            $table->string('error');
            $table->foreignUuid('user_uuid')->nullable()->unique();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('colour_schemes');
    }
};
