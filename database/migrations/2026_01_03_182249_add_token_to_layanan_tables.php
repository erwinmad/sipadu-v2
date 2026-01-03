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
        // Add token column to domisilis table
        Schema::table('domisilis', function (Blueprint $table) {
            $table->string('token', 8)->unique()->after('id');
        });

        // Add token column to sktms table
        Schema::table('sktms', function (Blueprint $table) {
            $table->string('token', 8)->unique()->after('id');
        });

        // Add token column to nikahs table
        Schema::table('nikahs', function (Blueprint $table) {
            $table->string('token', 8)->unique()->after('id');
        });

        // Add token column to usahas table
        Schema::table('usahas', function (Blueprint $table) {
            $table->string('token', 8)->unique()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('domisilis', function (Blueprint $table) {
            $table->dropColumn('token');
        });

        Schema::table('sktms', function (Blueprint $table) {
            $table->dropColumn('token');
        });

        Schema::table('nikahs', function (Blueprint $table) {
            $table->dropColumn('token');
        });

        Schema::table('usahas', function (Blueprint $table) {
            $table->dropColumn('token');
        });
    }
};
