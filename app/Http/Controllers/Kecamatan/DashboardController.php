<?php

namespace App\Http\Controllers\Kecamatan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $kecamatanCode = auth()->user()->kode_kecamatan;
        
        // Example stats: Total permohonan by type
        $stats = [
            ['name' => 'Domisili', 'value' => \App\Models\Domisili::where('kode_kecamatan', $kecamatanCode)->count(), 'color' => '#10b981'],
            ['name' => 'SKTM', 'value' => \App\Models\Sktm::where('kode_kecamatan', $kecamatanCode)->count(), 'color' => '#3b82f6'],
            ['name' => 'Nikah', 'value' => \App\Models\Nikah::where('kode_kecamatan', $kecamatanCode)->count(), 'color' => '#f59e0b'],
            ['name' => 'Usaha', 'value' => \App\Models\Usaha::where('kode_kecamatan', $kecamatanCode)->count(), 'color' => '#8b5cf6'],
        ];

        // Permohonan per bulan (last 6 months)
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $months[] = now()->subMonths($i)->format('Y-m');
        }
        
        $monthlyData = [];
        \Carbon\Carbon::setLocale('id');

        foreach ($months as $month) {
            $monthlyData[] = [
                'name' => \Carbon\Carbon::createFromFormat('Y-m', $month)->isoFormat('MMM YYYY'),
                'Domisili' => \App\Models\Domisili::where('kode_kecamatan', $kecamatanCode)->whereMonth('created_at', substr($month, 5, 2))->whereYear('created_at', substr($month, 0, 4))->count(),
                'SKTM' => \App\Models\Sktm::where('kode_kecamatan', $kecamatanCode)->whereMonth('created_at', substr($month, 5, 2))->whereYear('created_at', substr($month, 0, 4))->count(),
                'Nikah' => \App\Models\Nikah::where('kode_kecamatan', $kecamatanCode)->whereMonth('created_at', substr($month, 5, 2))->whereYear('created_at', substr($month, 0, 4))->count(),
                'Usaha' => \App\Models\Usaha::where('kode_kecamatan', $kecamatanCode)->whereMonth('created_at', substr($month, 5, 2))->whereYear('created_at', substr($month, 0, 4))->count(),
            ];
        }

        return Inertia::render('Kecamatan/Dashboard/Index', [
            'stats' => $stats,
            'monthlyData' => $monthlyData,
            'totalPermohonan' => collect($stats)->sum('value'),
        ]);
    }
}
