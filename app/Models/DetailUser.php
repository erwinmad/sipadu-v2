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
        'verified_at' => 'datetime',
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

    public function verifiedByUser()
    {
        return $this->belongsTo(User::class, 'verified_by');
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

    // Check if profile is verified by admin kecamatan
    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }

    // Check if profile is rejected
    public function isRejected(): bool
    {
        return $this->verification_status === 'rejected';
    }

    // Check if profile is pending verification
    public function isPending(): bool
    {
        return $this->verification_status === 'pending';
    }
}
