<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('domisilis', function (Blueprint $table) {
            $table->string('no_surat')->nullable()->after('no_pengantar');
        });
        Schema::table('sktms', function (Blueprint $table) {
            $table->string('no_surat')->nullable()->after('no_pengantar');
        });
        Schema::table('nikahs', function (Blueprint $table) {
            $table->string('no_surat')->nullable()->after('no_pengantar');
        });
        Schema::table('usahas', function (Blueprint $table) {
            $table->string('no_surat')->nullable()->after('no_pengantar');
        });
    }

    public function down(): void
    {
        Schema::table('domisilis', function (Blueprint $table) {
            $table->dropColumn('no_surat');
        });
        Schema::table('sktms', function (Blueprint $table) {
            $table->dropColumn('no_surat');
        });
        Schema::table('nikahs', function (Blueprint $table) {
            $table->dropColumn('no_surat');
        });
        Schema::table('usahas', function (Blueprint $table) {
            $table->dropColumn('no_surat');
        });
    }
};
