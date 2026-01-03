<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kecamatan extends Model
{
    protected $fillable = ['id', 'nama_kecamatan'];
    protected $casts = ['id' => 'string'];
    public $incrementing = false;
    protected $keyType = 'string';
    public function desas()
    {
        return $this->hasMany(Desa::class, 'kode_kecamatan', 'id');
    }
}
