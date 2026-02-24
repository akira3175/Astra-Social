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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reporter_id');
            $table->enum('target_type', ['POST', 'USER', 'COMMENT']);
            $table->unsignedBigInteger('target_id');
            $table->text('reason');
            $table->enum('status', ['PENDING', 'RESOLVED', 'REJECTED'])->default('PENDING');

            $table->foreign('reporter_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
