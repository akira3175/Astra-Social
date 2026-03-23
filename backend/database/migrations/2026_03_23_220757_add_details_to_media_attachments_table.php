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
        Schema::table('media_attachments', function (Blueprint $table) {
            $table->string('original_name')->nullable()->after('file_type');
            $table->unsignedBigInteger('file_size')->nullable()->after('original_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media_attachments', function (Blueprint $table) {
            $table->dropColumn(['original_name', 'file_size']);
        });
    }
};
