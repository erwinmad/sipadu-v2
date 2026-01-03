<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Desa extends Model
{
    protected $fillable = ['id', 'kode_kecamatan', 'nama_desa'];
    protected $casts = ['id' => 'string', 'kode_kecamatan' => 'string'];
    public $incrementing = false;
    protected $keyType = 'string';

    public function kecamatan()
    {
        return $this->belongsTo(Kecamatan::class, 'kode_kecamatan', 'id');
    }
}
