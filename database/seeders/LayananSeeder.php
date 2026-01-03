<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LayananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $layanans = [
            [
                'nama_layanan' => 'Pembuatan Surat Domisili',
                'slug' => 'domisili',
                'deskripsi' => 'Layanan permohonan surat keterangan domisili untuk warga.',
                'is_active' => true,
            ],
            [
                'nama_layanan' => 'Pembuatan Surat Keterangan Tidak Mampu (SKTM)',
                'slug' => 'sktm',
                'deskripsi' => 'Layanan permohonan SKTM untuk keperluan bantuan sosial, kesehatan, atau pendidikan.',
                'is_active' => true,
            ],
            [
                'nama_layanan' => 'Pembuatan Surat Pengantar Nikah',
                'slug' => 'nikah',
                'deskripsi' => 'Layanan permohonan surat pengantar nikah (N1, N2, N4).',
                'is_active' => true,
            ],
            [
                'nama_layanan' => 'Pembuatan Surat Keterangan Usaha (SKU)',
                'slug' => 'usaha',
                'deskripsi' => 'Layanan permohonan surat keterangan usaha untuk keperluan perbankan atau izin usaha mikro.',
                'is_active' => true,
            ],
        ];

        foreach ($layanans as $layanan) {
            \App\Models\Layanan::create($layanan);
        }
    }
}
