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
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('kode_kec', 'kode_kecamatan');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('kode_kecamatan')->nullable()->change();
            $table->foreign('kode_kecamatan')->references('id')->on('kecamatans')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['kode_kecamatan']);
            $table->renameColumn('kode_kecamatan', 'kode_kec');
        });
    }
};
