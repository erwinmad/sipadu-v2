<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailUser extends Model
{
    use HasFactory;

    protected $table = 'detail_users';
    protected $guarded = ['id'];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kode_kecamatan', 'id');
    }

    public function desa()
    {
        return $this->belongsTo(Desa::class, 'kode_desa', 'id');
    }

    // Helper method to check if profile is complete
    public function isComplete()
    {
        return !empty($this->nik) 
            && !empty($this->no_telepon) 
            && !empty($this->alamat)
            && !empty($this->kode_kecamatan)
            && !empty($this->kode_desa)
            && !empty($this->pendidikan_terakhir)
            && !empty($this->foto_ktp)
            && !empty($this->foto_verifikasi);
    }
}
