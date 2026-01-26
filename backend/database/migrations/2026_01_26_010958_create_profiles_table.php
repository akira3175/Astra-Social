<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->primary();
            $table->string('first_name', 50)->nullable();
            $table->string('last_name', 50)->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar_url', 255)->nullable();
            $table->string('cover_url', 255)->nullable();
            $table->string('phone', 20)->unique()->nullable();
            $table->string('address', 255)->nullable();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['MALE', 'FEMALE', 'OTHER'])->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
