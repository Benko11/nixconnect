<?php
#
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
        Schema::create('posts_code', function (Blueprint $table) {
            $table->id();
            $table->foreignId('code_language_id')->references('id')->on('code_languages');
            $table->text('description')->nullable();
            $table->text('code');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('posts_code');
    }
};
