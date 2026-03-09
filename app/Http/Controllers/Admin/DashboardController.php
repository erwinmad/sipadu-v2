<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Domisili;
use App\Models\Sktm;
use App\Models\Nikah;
use App\Models\Usaha;
use App\Models\Kecamatan;
use App\Models\DetailUser;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        \Carbon\Carbon::setLocale('id');

        // === STATS CARDS ===
        $totalUsers = User::role('users')->count();
        $totalKecamatan = Kecamatan::count();
        $totalDomisili = Domisili::count();
        $totalSktm = Sktm::count();
        $totalNikah = Nikah::count();
        $totalUsaha = Usaha::count();
        $totalPermohonan = $totalDomisili + $totalSktm + $totalNikah + $totalUsaha;

        // Permohonan by status (across all types)
        $statusStats = [
            'pending' => Domisili::where('status', 'pending')->count() + Sktm::where('status', 'pending')->count() + Nikah::where('status', 'pending')->count() + Usaha::where('status', 'pending')->count(),
            'proses' => Domisili::where('status', 'proses')->count() + Sktm::where('status', 'proses')->count() + Nikah::where('status', 'proses')->count() + Usaha::where('status', 'proses')->count(),
            'selesai' => Domisili::where('status', 'selesai')->count() + Sktm::where('status', 'selesai')->count() + Nikah::where('status', 'selesai')->count() + Usaha::where('status', 'selesai')->count(),
            'ditolak' => Domisili::where('status', 'ditolak')->count() + Sktm::where('status', 'ditolak')->count() + Nikah::where('status', 'ditolak')->count() + Usaha::where('status', 'ditolak')->count(),
        ];

        // User verification stats
        $verificationStats = [
            'pending' => DetailUser::where('verification_status', 'pending')->count(),
            'verified' => DetailUser::where('verification_status', 'verified')->count(),
            'rejected' => DetailUser::where('verification_status', 'rejected')->count(),
        ];

        // === PERMOHONAN BY TYPE (pie chart) ===
        $permohonanByType = [
            ['name' => 'Domisili', 'value' => $totalDomisili, 'color' => '#10b981'],
            ['name' => 'SKTM', 'value' => $totalSktm, 'color' => '#3b82f6'],
            ['name' => 'Nikah', 'value' => $totalNikah, 'color' => '#f59e0b'],
            ['name' => 'Usaha', 'value' => $totalUsaha, 'color' => '#8b5cf6'],
        ];

        // === MONTHLY TREND (last 6 months) ===
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $months[] = now()->subMonths($i)->format('Y-m');
        }

        $monthlyData = [];
        foreach ($months as $month) {
            $m = substr($month, 5, 2);
            $y = substr($month, 0, 4);
            $monthlyData[] = [
                'name' => \Carbon\Carbon::createFromFormat('Y-m', $month)->isoFormat('MMM YY'),
                'Domisili' => Domisili::whereMonth('created_at', $m)->whereYear('created_at', $y)->count(),
                'SKTM' => Sktm::whereMonth('created_at', $m)->whereYear('created_at', $y)->count(),
                'Nikah' => Nikah::whereMonth('created_at', $m)->whereYear('created_at', $y)->count(),
                'Usaha' => Usaha::whereMonth('created_at', $m)->whereYear('created_at', $y)->count(),
            ];
        }

        // === RECENT PERMOHONAN (last 10) ===
        $recentPermohonan = collect()
            ->merge(Domisili::with(['user', 'kecamatan', 'desa'])->latest()->take(10)->get()->map(fn($i) => array_merge($i->toArray(), ['jenis' => 'Domisili'])))
            ->merge(Sktm::with(['user', 'kecamatan', 'desa'])->latest()->take(10)->get()->map(fn($i) => array_merge($i->toArray(), ['jenis' => 'SKTM'])))
            ->merge(Nikah::with(['user', 'kecamatan', 'desa'])->latest()->take(10)->get()->map(fn($i) => array_merge($i->toArray(), ['jenis' => 'Nikah'])))
            ->merge(Usaha::with(['user', 'kecamatan', 'desa'])->latest()->take(10)->get()->map(fn($i) => array_merge($i->toArray(), ['jenis' => 'Usaha'])))
            ->sortByDesc('created_at')
            ->take(10)
            ->values();

        // === RECENT USERS (last 10) ===
        $recentUsers = User::with(['roles', 'detailUser.kecamatan', 'detailUser.desa'])
            ->role('users')
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'verification_status' => $user->detailUser?->verification_status ?? 'belum lengkap',
                    'kecamatan' => $user->detailUser?->kecamatan?->nama_kecamatan ?? '-',
                    'desa' => $user->detailUser?->desa?->nama_desa ?? '-',
                    'nik' => $user->detailUser?->nik ?? '-',
                ];
            });

        // === PERMOHONAN BY KECAMATAN ===
        $kecamatans = Kecamatan::all();
        $permohonanByKecamatan = $kecamatans->map(function ($kec) {
            return [
                'name' => str_replace('KECAMATAN ', '', strtoupper($kec->nama_kecamatan)),
                'total' => Domisili::where('kode_kecamatan', $kec->id)->count()
                    + Sktm::where('kode_kecamatan', $kec->id)->count()
                    + Nikah::where('kode_kecamatan', $kec->id)->count()
                    + Usaha::where('kode_kecamatan', $kec->id)->count(),
            ];
        })->sortByDesc('total')->take(10)->values();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalKecamatan' => $totalKecamatan,
                'totalPermohonan' => $totalPermohonan,
                'statusStats' => $statusStats,
                'verificationStats' => $verificationStats,
            ],
            'permohonanByType' => $permohonanByType,
            'monthlyData' => $monthlyData,
            'recentPermohonan' => $recentPermohonan,
            'recentUsers' => $recentUsers,
            'permohonanByKecamatan' => $permohonanByKecamatan,
        ]);
    }
}
