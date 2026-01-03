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
        Schema::create('nikahs', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->string('kode_kecamatan')->nullable();
            $table->foreign('kode_kecamatan')->references('id')->on('kecamatans');

            $table->string('kode_desa')->nullable();
            
            $table->string('no_pengantar');
            $table->date('tgl_pengantar');
            
            // Pria (Mempelai 1 - Asumsi user yang login)
            $table->string('bin_mempelai1'); // Ubah typok: mempelay -> mempelai
            $table->string('status_mempelai1');
            $table->string('calon_mempelai1'); // Nama Pria
            
            // Wanita (Mempelai 2) - Atau sebaliknya, tergantung input form
            $table->string('calon_mempelai2'); // ? Mungkin ini maksudnya NIK atau Nama panggilan? 
            $table->string('nama_mempelai2');
            $table->string('bin_mempelai2');
            $table->string('tmp_lahir_mempelai2');
            $table->date('tgl_lahir_mempelai2');
            $table->string('agama_mempelai2');
            $table->string('wn_mempelai2'); // Warga Negara
            $table->string('pekerjaan_mempelai2');
            $table->string('status_mempelai2');
            $table->string('alamat_mempelai2');
            
            // Detail Acara
            $table->string('hari_nikah');
            $table->date('tgl_nikah');
            $table->string('alamat_nikah');
            $table->text('alasan')->nullable(); // Alasan pindah nikah (jika N.A. surat rekomendasi nikah)
            
            // Dokumen
            $table->string('ktp_pria');
            $table->string('ktp_wanita');
            $table->string('bukti_pendaftaran')->nullable(); // Upload bukti
            
            // Output
            $table->string('file_hasil')->nullable(); // Surat Rekomendasi
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
        Schema::dropIfExists('nikahs');
    }
};
