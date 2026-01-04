<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('detail_users', function (Blueprint $table) {
            $table->string('foto_ktp')->nullable()->after('jenis_kelamin');
        });
    }

    public function down(): void
    {
        Schema::table('detail_users', function (Blueprint $table) {
            $table->dropColumn('foto_ktp');
        });
    }
};
