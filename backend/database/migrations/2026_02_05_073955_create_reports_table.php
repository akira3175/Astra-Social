<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{

    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reporter_id');
            $table->unsignedBigInteger('target_author_id');
            $table->text('target_preview');
            $table->enum('target_type', ['POST', 'USER', 'COMMENT']);
            $table->unsignedBigInteger('target_id');
            $table->text('reason');
            $table->enum('status', ['PENDING', 'RESOLVED', 'REJECTED'])->default('PENDING');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('target_author_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('cascade');

            $table->foreign('reporter_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
