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
        Schema::create('media_attachments', function (Blueprint $table) {
            $table->id();
            $table->string('url', 500);
            $table->enum('file_type', ['IMAGE', 'VIDEO', 'FILE'])->default('FILE');
            $table->string('entity_type', 20); // POST, COMMENT, MESSAGE
            $table->unsignedBigInteger('entity_id');
            $table->timestamp('created_at')->useCurrent();

            // Index for faster lookups
            $table->index(['entity_type', 'entity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_attachments');
    }
};
