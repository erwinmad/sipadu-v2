<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KecamatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kecamatans = [
            ['id' => '32.05.010', 'nama_kecamatan' => 'AGRABINTA'],
            ['id' => '32.05.011', 'nama_kecamatan' => 'LELES'],
            ['id' => '32.05.020', 'nama_kecamatan' => 'SINDANGBARANG'],
            ['id' => '32.05.030', 'nama_kecamatan' => 'CIDAUN'],
            ['id' => '32.05.040', 'nama_kecamatan' => 'NARINGGUL'],
            ['id' => '32.05.050', 'nama_kecamatan' => 'CIBINONG'],
            ['id' => '32.05.051', 'nama_kecamatan' => 'CIKADU'],
            ['id' => '32.05.060', 'nama_kecamatan' => 'TANGGEUNG'],
            ['id' => '32.05.061', 'nama_kecamatan' => 'PASIRKUDA'],
            ['id' => '32.05.070', 'nama_kecamatan' => 'PAGELARAN'],
            ['id' => '32.05.080', 'nama_kecamatan' => 'KADUPANDAK'],
            ['id' => '32.05.081', 'nama_kecamatan' => 'CIJATI'],
            ['id' => '32.05.090', 'nama_kecamatan' => 'TAKOKAK'],
            ['id' => '32.05.100', 'nama_kecamatan' => 'SUKANAGARA'],
            ['id' => '32.05.110', 'nama_kecamatan' => 'CAMPAKA'],
            ['id' => '32.05.111', 'nama_kecamatan' => 'CAMPAKAMULYA'],
            ['id' => '32.05.120', 'nama_kecamatan' => 'CIBEBER'],
            ['id' => '32.05.130', 'nama_kecamatan' => 'BOJONGPICUNG'],
            ['id' => '32.05.131', 'nama_kecamatan' => 'HAURWANGI'],
            ['id' => '32.05.140', 'nama_kecamatan' => 'CIRANJANG'],
            ['id' => '32.05.141', 'nama_kecamatan' => 'SUKALUYU'],
            ['id' => '32.05.150', 'nama_kecamatan' => 'KARANGTENGAH'],
            ['id' => '32.05.160', 'nama_kecamatan' => 'CIANJUR'],
            ['id' => '32.05.161', 'nama_kecamatan' => 'CILAKU'],
            ['id' => '32.05.170', 'nama_kecamatan' => 'WARUNGKONDANG'],
            ['id' => '32.05.171', 'nama_kecamatan' => 'GEKBRONG'],
            ['id' => '32.05.180', 'nama_kecamatan' => 'CUGENANG'],
            ['id' => '32.05.190', 'nama_kecamatan' => 'PACET'],
            ['id' => '32.05.191', 'nama_kecamatan' => 'SUKARESMI'],
            ['id' => '32.05.192', 'nama_kecamatan' => 'CIPANAS'],
            ['id' => '32.05.200', 'nama_kecamatan' => 'MANDE'],
            ['id' => '32.05.210', 'nama_kecamatan' => 'CIKALONGKULON'],
        ];

        foreach ($kecamatans as $kecamatan) {
            \Illuminate\Support\Facades\DB::table('kecamatans')->insert([
                'id' => $kecamatan['id'],
                'nama_kecamatan' => $kecamatan['nama_kecamatan'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
