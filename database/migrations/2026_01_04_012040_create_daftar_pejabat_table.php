<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daftar_pejabat', function (Blueprint $table) {
            $table->id();
            $table->string('kode_kecamatan');
            $table->foreign('kode_kecamatan')->references('id')->on('kecamatans')->onDelete('cascade');
            
            // Pejabat Info
            $table->string('nama_pejabat');
            $table->string('nip', 18)->unique();
            $table->string('jabatan'); // Camat, Sekretaris Camat, etc
            $table->enum('jenis_pejabat', ['camat', 'sekretaris', 'kasi', 'lainnya'])->default('lainnya');
            
            // Digital Signature
            $table->string('ttd_digital')->nullable(); // Path to signature image
            $table->string('stempel')->nullable(); // Path to stamp image
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->date('mulai_jabatan')->nullable();
            $table->date('selesai_jabatan')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daftar_pejabat');
    }
};
