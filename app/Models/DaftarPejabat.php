<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DaftarPejabat extends Model
{
    use HasFactory;

    protected $table = 'daftar_pejabat';
    protected $guarded = ['id'];

    protected $casts = [
        'is_active' => 'boolean',
        'mulai_jabatan' => 'date',
        'selesai_jabatan' => 'date',
    ];

    // Relationships
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kode_kecamatan', 'id');
    }

    public function detailKecamatan()
    {
        return $this->belongsTo(DetailKecamatan::class, 'kode_kecamatan', 'kode_kecamatan');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeCamat($query)
    {
        return $query->where('jenis_pejabat', 'camat');
    }

    // Helper to check if signature is complete
    public function hasCompleteSignature()
    {
        return !empty($this->ttd_digital) && !empty($this->stempel);
    }
}
