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
        Schema::table('sktms', function (Blueprint $table) {
            // Rename tujuan to peruntukan if exists
            if (Schema::hasColumn('sktms', 'tujuan')) {
                $table->renameColumn('tujuan', 'peruntukan');
            }
            
            // Add new columns if they don't exist
            if (!Schema::hasColumn('sktms', 'penghasilan')) {
                $table->string('penghasilan')->nullable()->after('peruntukan');
            }
            if (!Schema::hasColumn('sktms', 'tanggungan')) {
                $table->string('tanggungan')->nullable()->after('penghasilan');
            }
            if (!Schema::hasColumn('sktms', 'pernyataan')) {
                $table->string('pernyataan')->nullable()->after('pengantar');
            }
            if (!Schema::hasColumn('sktms', 'token')) {
                $table->string('token', 8)->unique()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sktms', function (Blueprint $table) {
            $table->dropColumn(['penghasilan', 'tanggungan', 'pernyataan', 'token']);
            if (Schema::hasColumn('sktms', 'peruntukan')) {
                $table->renameColumn('peruntukan', 'tujuan');
            }
        });
    }
};
