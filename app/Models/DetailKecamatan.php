<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailKecamatan extends Model
{
    use HasFactory;

    protected $table = 'detail_kecamatan';
    protected $guarded = ['id'];

    // Relationships
    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kode_kecamatan', 'id');
    }

    public function pejabat()
    {
        return $this->hasMany(DaftarPejabat::class, 'kode_kecamatan', 'kode_kecamatan');
    }

    public function activePejabat()
    {
        return $this->hasMany(DaftarPejabat::class, 'kode_kecamatan', 'kode_kecamatan')
            ->where('is_active', true);
    }
}
