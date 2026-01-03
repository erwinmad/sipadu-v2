<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Domisili;
use App\Models\Sktm;
use App\Models\Nikah;
use App\Models\Usaha;

class TrackingController extends Controller
{
    public function index()
    {
        return Inertia::render('Tracking/Index');
    }

    public function show(Request $request)
    {
        $request->validate([
            'token' => 'required|string|size:8',
        ]);

        $token = strtoupper($request->token);
        $permohonan = null;
        $jenis = null;

        // Check in all tables
        if ($domisili = Domisili::where('token', $token)->with(['user', 'kecamatan'])->first()) {
            $permohonan = $domisili;
            $jenis = 'Surat Keterangan Domisili';
        } elseif ($sktm = Sktm::where('token', $token)->with(['user', 'kecamatan'])->first()) {
            $permohonan = $sktm;
            $jenis = 'Surat Keterangan Tidak Mampu (SKTM)';
        } elseif ($nikah = Nikah::where('token', $token)->with(['user', 'kecamatan'])->first()) {
            $permohonan = $nikah;
            $jenis = 'Surat Rekomendasi Nikah';
        } elseif ($usaha = Usaha::where('token', $token)->with(['user', 'kecamatan'])->first()) {
            $permohonan = $usaha;
            $jenis = 'Surat Keterangan Usaha';
        }

        if (!$permohonan) {
            return redirect()->back()->with('error', 'Token tidak ditemukan. Pastikan token yang Anda masukkan benar.');
        }

        return Inertia::render('Tracking/Show', [
            'permohonan' => $permohonan,
            'jenis' => $jenis,
        ]);
    }
}
