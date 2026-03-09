<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Domisili;
use App\Models\Sktm;
use App\Models\Nikah;
use App\Models\Usaha;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermohonanController extends Controller
{
    public function index(Request $request)
    {
        $permohonan = collect()
            ->merge(Domisili::with(['user', 'kecamatan', 'desa'])->get()->map(fn($i) => array_merge($i->toArray(), ['jenis' => 'Domisili'])))
            ->merge(Sktm::with(['user', 'kecamatan', 'desa'])->get()->map(fn($i) => array_merge($i->toArray(), ['jenis' => 'SKTM'])))
            ->merge(Nikah::with(['user', 'kecamatan', 'desa'])->get()->map(fn($i) => array_merge($i->toArray(), ['jenis' => 'Nikah'])))
            ->merge(Usaha::with(['user', 'kecamatan', 'desa'])->get()->map(fn($i) => array_merge($i->toArray(), ['jenis' => 'Usaha'])))
            ->sortByDesc('created_at')
            ->values();

        // Filter by status
        if ($request->filled('status')) {
            $permohonan = $permohonan->where('status', $request->status)->values();
        }

        // Filter by jenis
        if ($request->filled('jenis')) {
            $permohonan = $permohonan->where('jenis', $request->jenis)->values();
        }

        // Search
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $permohonan = $permohonan->filter(function ($item) use ($search) {
                return str_contains(strtolower($item['token'] ?? ''), $search)
                    || str_contains(strtolower($item['user']['name'] ?? ''), $search)
                    || str_contains(strtolower($item['user']['email'] ?? ''), $search);
            })->values();
        }

        $stats = [
            'total' => $permohonan->count(),
            'pending' => $permohonan->where('status', 'pending')->count(),
            'proses' => $permohonan->where('status', 'proses')->count(),
            'selesai' => $permohonan->where('status', 'selesai')->count(),
            'ditolak' => $permohonan->where('status', 'ditolak')->count(),
        ];

        return Inertia::render('Admin/Permohonan/Index', [
            'permohonan' => $permohonan->all(),
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'jenis']),
        ]);
    }
}
