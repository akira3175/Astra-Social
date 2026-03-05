<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Cần import DB để dùng SQL thuần

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

        // 2. Tạo Trigger tự động thêm dòng vào profiles khi có user mới
        DB::unprepared('
            CREATE TRIGGER after_user_insert
            AFTER INSERT ON users
            FOR EACH ROW
            BEGIN
                INSERT INTO profiles (user_id)
                VALUES (NEW.id);
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Xóa trigger trước khi xóa bảng để tránh lỗi
        DB::unprepared('DROP TRIGGER IF EXISTS after_user_insert');
        Schema::dropIfExists('profiles');
    }
};