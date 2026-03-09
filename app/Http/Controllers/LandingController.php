<?php

namespace App\Http\Controllers;

use App\Models\Layanan;
use App\Models\Domisili;
use App\Models\Sktm;
use App\Models\Nikah;
use App\Models\Usaha;
use App\Models\Kecamatan;
use App\Models\Desa;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index(Request $request)
    {
        $tahun = $request->get('tahun', date('Y'));
        $layanans = Layanan::where('is_active', true)->get();

        // Calculate overall statistics
        $stats = [
            'total_permohonan' => Domisili::count() + Sktm::count() + Nikah::count() + Usaha::count(),
            'permohonan_selesai' => Domisili::where('status', 'selesai')->count() + 
                                    Sktm::where('status', 'selesai')->count() + 
                                    Nikah::where('status', 'selesai')->count() + 
                                    Usaha::where('status', 'selesai')->count(),
            'permohonan_proses' => Domisili::where('status', 'proses')->count() + 
                                   Sktm::where('status', 'proses')->count() + 
                                   Nikah::where('status', 'proses')->count() + 
                                   Usaha::where('status', 'proses')->count(),
            'total_pengguna' => User::count(),
            'total_kecamatan' => Kecamatan::count(),
            'total_desa' => Desa::count(),
        ];

        // Permohonan by Jenis (filtered by year)
        $permohonanByJenis = [
            ['jenis' => 'Domisili', 'total' => Domisili::whereYear('created_at', $tahun)->count()],
            ['jenis' => 'SKTM', 'total' => Sktm::whereYear('created_at', $tahun)->count()],
            ['jenis' => 'Nikah', 'total' => Nikah::whereYear('created_at', $tahun)->count()],
            ['jenis' => 'Usaha', 'total' => Usaha::whereYear('created_at', $tahun)->count()],
        ];

        // Permohonan by Kecamatan (filtered by year)
        $kecamatans = Kecamatan::orderBy('nama_kecamatan')->get();
        $permohonanByKecamatan = [];

        foreach ($kecamatans as $kec) {
            $total = Domisili::where('kode_kecamatan', $kec->id)->whereYear('created_at', $tahun)->count()
                   + Sktm::where('kode_kecamatan', $kec->id)->whereYear('created_at', $tahun)->count()
                   + Nikah::where('kode_kecamatan', $kec->id)->whereYear('created_at', $tahun)->count()
                   + Usaha::where('kode_kecamatan', $kec->id)->whereYear('created_at', $tahun)->count();

            if ($total > 0) {
                $permohonanByKecamatan[] = [
                    'kecamatan' => $kec->nama_kecamatan,
                    'total' => $total,
                ];
            }
        }

        // Sort by total descending
        usort($permohonanByKecamatan, fn($a, $b) => $b['total'] - $a['total']);

        // Available years for filter
        $years = collect();
        foreach ([Domisili::class, Sktm::class, Nikah::class, Usaha::class] as $model) {
            $modelYears = $model::selectRaw('EXTRACT(YEAR FROM created_at)::int as year')
                ->distinct()
                ->pluck('year');
            $years = $years->merge($modelYears);
        }
        $availableYears = $years->unique()->filter()->sort()->values()->toArray();
        
        if (empty($availableYears)) {
            $availableYears = [(int) date('Y')];
        }

        return Inertia::render('Landing/Index', [
            'layanans' => $layanans,
            'stats' => $stats,
            'permohonanByJenis' => $permohonanByJenis,
            'permohonanByKecamatan' => $permohonanByKecamatan,
            'tahun' => (int) $tahun,
            'availableYears' => $availableYears,
        ]);
    }
}
