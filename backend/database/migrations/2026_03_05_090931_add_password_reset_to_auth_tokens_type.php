<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE auth_tokens MODIFY COLUMN type ENUM('REFRESH', 'OTP_EMAIL', 'OTP_PASS', 'PASSWORD_RESET') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE auth_tokens MODIFY COLUMN type ENUM('REFRESH', 'OTP_EMAIL', 'OTP_PASS') NOT NULL");
    }
};
