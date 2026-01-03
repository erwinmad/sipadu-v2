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
        Schema::create('layanans', function (Blueprint $table) {
            $table->id();
            $table->string('nama_layanan');
            $table->string('slug')->unique(); // domisili, sktm, nikah, usaha
            $table->text('deskripsi')->nullable(); // Penjelasan layanan
            $table->boolean('is_active')->default(true); // Status aktif/non-aktif
            $table->text('informasi_status')->nullable(); // Pesan jika non-aktif
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('layanans');
    }
};
