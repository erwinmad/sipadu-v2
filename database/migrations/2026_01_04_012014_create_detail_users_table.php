<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_users', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Personal Info
            $table->string('nik', 16)->unique();
            $table->string('no_telepon', 15);
            $table->text('alamat');
            $table->string('kode_kecamatan');
            $table->foreign('kode_kecamatan')->references('id')->on('kecamatans');
            $table->string('kode_desa');
            $table->string('pendidikan_terakhir');
            $table->string('pekerjaan')->nullable();
            
            // Additional
            $table->date('tanggal_lahir')->nullable();
            $table->string('tempat_lahir')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_users');
    }
};
