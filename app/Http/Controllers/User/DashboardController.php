<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Domisili;
use App\Models\Sktm;
use App\Models\Nikah;
use App\Models\Usaha;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        // Get all permohonan belonging to this user
        $domisilis = Domisili::with(['kecamatan', 'desa'])
            ->where('user_id', $userId)
            ->latest()
            ->get()
            ->map(fn($item) => array_merge($item->toArray(), ['jenis' => 'Domisili']));

        $sktms = Sktm::with(['kecamatan', 'desa'])
            ->where('user_id', $userId)
            ->latest()
            ->get()
            ->map(fn($item) => array_merge($item->toArray(), ['jenis' => 'SKTM']));

        $nikahs = Nikah::with(['kecamatan', 'desa'])
            ->where('user_id', $userId)
            ->latest()
            ->get()
            ->map(fn($item) => array_merge($item->toArray(), ['jenis' => 'Nikah']));

        $usahas = Usaha::with(['kecamatan', 'desa'])
            ->where('user_id', $userId)
            ->latest()
            ->get()
            ->map(fn($item) => array_merge($item->toArray(), ['jenis' => 'Usaha']));

        $permohonan = collect()
            ->merge($domisilis)
            ->merge($sktms)
            ->merge($nikahs)
            ->merge($usahas)
            ->sortByDesc('created_at')
            ->values();

        return Inertia::render('User/Dashboard/Index', [
            'permohonan' => $permohonan,
            'stats' => [
                'total' => $permohonan->count(),
                'pending' => $permohonan->where('status', 'pending')->count(),
                'proses' => $permohonan->where('status', 'proses')->count(),
                'selesai' => $permohonan->where('status', 'selesai')->count(),
                'ditolak' => $permohonan->where('status', 'ditolak')->count(),
            ],
        ]);
    }
}
