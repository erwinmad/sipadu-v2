<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('usahas', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->string('kode_kecamatan')->nullable();
            $table->foreign('kode_kecamatan')->references('id')->on('kecamatans');

            $table->string('kode_desa')->nullable();
            
            $table->string('no_pengantar');
            $table->date('tgl_pengantar');
            
            $table->string('jenis_usaha');
            $table->string('kegiatan_usaha');
            $table->string('nama_perusahaan');
            $table->string('pemilik_usaha');
            $table->string('alamat_usaha');
            
            // Dokumen
            $table->string('ktp');
            $table->string('sku')->nullable(); // Surat Keterangan Usaha dari Desa (mungkin?)
            
            // Output
            $table->string('file_hasil')->nullable();
            $table->text('tanggapan')->nullable();
            $table->enum('status', ['pending', 'proses', 'selesai', 'ditolak'])->default('pending');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('usahas');
    }
};
