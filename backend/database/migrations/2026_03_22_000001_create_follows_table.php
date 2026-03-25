<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('follows', function (Blueprint $table) {
            $table->unsignedBigInteger('follower_id');
            $table->unsignedBigInteger('followee_id');
            $table->timestamp('created_at')->useCurrent();

            $table->primary(['follower_id', 'followee_id']);

            $table->foreign('follower_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('followee_id')->references('id')->on('users')->onDelete('cascade');

            $table->index('follower_id');
            $table->index('followee_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('follows');
    }
};
