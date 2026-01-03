<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Layanan extends Model
{
    protected $fillable = [
        'nama_layanan',
        'slug',
        'deskripsi',
        'is_active',
        'informasi_status', // Pesan jika layanan non-aktif
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
