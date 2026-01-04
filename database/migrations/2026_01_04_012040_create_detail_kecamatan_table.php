<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_kecamatan', function (Blueprint $table) {
            $table->id();
            $table->string('kode_kecamatan')->unique();
            $table->foreign('kode_kecamatan')->references('id')->on('kecamatans')->onDelete('cascade');
            
            // Kecamatan Info
            $table->string('alamat_kantor');
            $table->string('no_telepon', 15);
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            
            // Digital Signature
            $table->string('logo_kecamatan')->nullable(); // Path to logo
            $table->string('kop_surat')->nullable(); // Path to letterhead template
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_kecamatan');
    }
};
