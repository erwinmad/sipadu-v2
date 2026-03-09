<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domisili;
use App\Models\Sktm;
use App\Models\Nikah;
use App\Models\Usaha;
use App\Models\DetailUser;
use App\Models\Kecamatan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DashboardApiController extends Controller
{
    /**
     * Dashboard ringkasan untuk 1 kecamatan.
     * Menggabungkan statistik permohonan, verifikasi user, tren bulanan,
     * dan data terbaru dalam 1 API call.
     *
     * GET /api/dashboard?kode_kecamatan=XXX
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'kode_kecamatan' => 'required|string|exists:kecamatans,id',
        ]);

        $kode = $request->input('kode_kecamatan');
        $kecamatan = Kecamatan::find($kode);

        \Carbon\Carbon::setLocale('id');

        // === PERMOHONAN STATS ===
        $domisiliCount = Domisili::where('kode_kecamatan', $kode)->count();
        $sktmCount = Sktm::where('kode_kecamatan', $kode)->count();
        $nikahCount = Nikah::where('kode_kecamatan', $kode)->count();
        $usahaCount = Usaha::where('kode_kecamatan', $kode)->count();
        $totalPermohonan = $domisiliCount + $sktmCount + $nikahCount + $usahaCount;

        $statusStats = [
            'pending' => Domisili::where('kode_kecamatan', $kode)->where('status', 'pending')->count()
                + Sktm::where('kode_kecamatan', $kode)->where('status', 'pending')->count()
                + Nikah::where('kode_kecamatan', $kode)->where('status', 'pending')->count()
                + Usaha::where('kode_kecamatan', $kode)->where('status', 'pending')->count(),
            'proses' => Domisili::where('kode_kecamatan', $kode)->where('status', 'proses')->count()
                + Sktm::where('kode_kecamatan', $kode)->where('status', 'proses')->count()
                + Nikah::where('kode_kecamatan', $kode)->where('status', 'proses')->count()
                + Usaha::where('kode_kecamatan', $kode)->where('status', 'proses')->count(),
            'selesai' => Domisili::where('kode_kecamatan', $kode)->where('status', 'selesai')->count()
                + Sktm::where('kode_kecamatan', $kode)->where('status', 'selesai')->count()
                + Nikah::where('kode_kecamatan', $kode)->where('status', 'selesai')->count()
                + Usaha::where('kode_kecamatan', $kode)->where('status', 'selesai')->count(),
            'ditolak' => Domisili::where('kode_kecamatan', $kode)->where('status', 'ditolak')->count()
                + Sktm::where('kode_kecamatan', $kode)->where('status', 'ditolak')->count()
                + Nikah::where('kode_kecamatan', $kode)->where('status', 'ditolak')->count()
                + Usaha::where('kode_kecamatan', $kode)->where('status', 'ditolak')->count(),
        ];

        // === BY TYPE ===
        $byType = [
            ['name' => 'Domisili', 'value' => $domisiliCount],
            ['name' => 'SKTM', 'value' => $sktmCount],
            ['name' => 'Nikah', 'value' => $nikahCount],
            ['name' => 'Usaha', 'value' => $usahaCount],
        ];

        // === MONTHLY TREND (6 months) ===
        $monthlyData = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $m = $date->format('m');
            $y = $date->format('Y');
            $monthlyData[] = [
                'name' => $date->isoFormat('MMM YY'),
                'Domisili' => Domisili::where('kode_kecamatan', $kode)->whereMonth('created_at', $m)->whereYear('created_at', $y)->count(),
                'SKTM' => Sktm::where('kode_kecamatan', $kode)->whereMonth('created_at', $m)->whereYear('created_at', $y)->count(),
                'Nikah' => Nikah::where('kode_kecamatan', $kode)->whereMonth('created_at', $m)->whereYear('created_at', $y)->count(),
                'Usaha' => Usaha::where('kode_kecamatan', $kode)->whereMonth('created_at', $m)->whereYear('created_at', $y)->count(),
            ];
        }

        // === VERIFICATION STATS ===
        $baseVerif = DetailUser::where('kode_kecamatan', $kode)
            ->whereNotNull('nik')
            ->whereNotNull('foto_ktp')
            ->whereNotNull('foto_verifikasi');

        $verificationStats = [
            'total' => (clone $baseVerif)->count(),
            'pending' => (clone $baseVerif)->where('verification_status', 'pending')->count(),
            'verified' => (clone $baseVerif)->where('verification_status', 'verified')->count(),
            'rejected' => (clone $baseVerif)->where('verification_status', 'rejected')->count(),
        ];

        // === RECENT PERMOHONAN (5 terbaru) ===
        $recentPermohonan = collect()
            ->merge(Domisili::with(['user', 'desa'])->where('kode_kecamatan', $kode)->latest()->take(5)->get()->map(fn($i) => array_merge($i->only(['id', 'token', 'status', 'created_at']), ['jenis' => 'Domisili', 'user_name' => $i->user?->name, 'desa' => $i->desa?->nama_desa])))
            ->merge(Sktm::with(['user', 'desa'])->where('kode_kecamatan', $kode)->latest()->take(5)->get()->map(fn($i) => array_merge($i->only(['id', 'token', 'status', 'created_at']), ['jenis' => 'SKTM', 'user_name' => $i->user?->name, 'desa' => $i->desa?->nama_desa])))
            ->merge(Nikah::with(['user', 'desa'])->where('kode_kecamatan', $kode)->latest()->take(5)->get()->map(fn($i) => array_merge($i->only(['id', 'token', 'status', 'created_at']), ['jenis' => 'Nikah', 'user_name' => $i->user?->name, 'desa' => $i->desa?->nama_desa])))
            ->merge(Usaha::with(['user', 'desa'])->where('kode_kecamatan', $kode)->latest()->take(5)->get()->map(fn($i) => array_merge($i->only(['id', 'token', 'status', 'created_at']), ['jenis' => 'Usaha', 'user_name' => $i->user?->name, 'desa' => $i->desa?->nama_desa])))
            ->sortByDesc('created_at')
            ->take(5)
            ->values();

        // === RECENT USERS PENDING VERIFICATION (5 terbaru) ===
        $pendingUsers = DetailUser::with(['user'])
            ->where('kode_kecamatan', $kode)
            ->where('verification_status', 'pending')
            ->whereNotNull('nik')
            ->whereNotNull('foto_ktp')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($d) => [
                'user_id' => $d->user_id,
                'name' => $d->user?->name,
                'email' => $d->user?->email,
                'nik' => $d->nik,
                'created_at' => $d->created_at?->toISOString(),
            ]);

        return response()->json([
            'success' => true,
            'kecamatan' => [
                'kode' => $kecamatan->id,
                'nama' => $kecamatan->nama_kecamatan,
            ],
            'permohonan' => [
                'total' => $totalPermohonan,
                'by_status' => $statusStats,
                'by_type' => $byType,
                'monthly_trend' => $monthlyData,
                'recent' => $recentPermohonan,
            ],
            'verifikasi' => [
                'stats' => $verificationStats,
                'pending_users' => $pendingUsers,
            ],
        ]);
    }
}
