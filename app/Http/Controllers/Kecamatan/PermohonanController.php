<?php

namespace App\Http\Controllers\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\Domisili;
use App\Models\Sktm;
use App\Models\Nikah;
use App\Models\Usaha;
use App\Models\Kecamatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PermohonanController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Get user's kecamatan
        $kecamatan = Kecamatan::where('nama_kecamatan', 'LIKE', '%' . $user->name . '%')->first();
        
        if (!$kecamatan) {
            // If no kecamatan found, get all (for super admin)
            $kecamatanCode = null;
        } else {
            $kecamatanCode = $kecamatan->id;
        }

        // Get all permohonan from all tables
        $domisilis = Domisili::with(['user', 'kecamatan', 'desa'])
            ->when($kecamatanCode, fn($q) => $q->where('kode_kecamatan', $kecamatanCode))
            ->latest()
            ->get()
            ->map(fn($item) => array_merge($item->toArray(), ['jenis' => 'Domisili']));

        $sktms = Sktm::with(['user', 'kecamatan', 'desa'])
            ->when($kecamatanCode, fn($q) => $q->where('kode_kecamatan', $kecamatanCode))
            ->latest()
            ->get()
            ->map(fn($item) => array_merge($item->toArray(), ['jenis' => 'SKTM']));

        $nikahs = Nikah::with(['user', 'kecamatan', 'desa'])
            ->when($kecamatanCode, fn($q) => $q->where('kode_kecamatan', $kecamatanCode))
            ->latest()
            ->get()
            ->map(fn($item) => array_merge($item->toArray(), ['jenis' => 'Nikah']));

        $usahas = Usaha::with(['user', 'kecamatan', 'desa'])
            ->when($kecamatanCode, fn($q) => $q->where('kode_kecamatan', $kecamatanCode))
            ->latest()
            ->get()
            ->map(fn($item) => array_merge($item->toArray(), ['jenis' => 'Usaha']));

        // Merge and sort by created_at
        $permohonan = collect()
            ->merge($domisilis)
            ->merge($sktms)
            ->merge($nikahs)
            ->merge($usahas)
            ->sortByDesc('created_at')
            ->values();

        return Inertia::render('Kecamatan/Permohonan/Index', [
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

    public function show($jenis, $token)
    {
        $model = $this->getModel($jenis);
        $permohonan = $model::with(['user', 'kecamatan', 'desa'])
            ->where('token', $token)
            ->firstOrFail();

        // Get activity logs
        $activities = $permohonan->activities()
            ->with('causer')
            ->latest()
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'description' => $activity->description,
                    'properties' => $activity->properties,
                    'created_at' => $activity->created_at->toISOString(),
                    'causer' => $activity->causer ? [
                        'name' => $activity->causer->name,
                        'email' => $activity->causer->email,
                    ] : null,
                ];
            });

        return Inertia::render('Kecamatan/Permohonan/Show', [
            'permohonan' => $permohonan,
            'jenis' => $jenis,
            'activities' => $activities,
        ]);
    }

    public function update(Request $request, $jenis, $token)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,proses,selesai,ditolak',
            'tanggapan' => 'nullable|string',
            'file_hasil' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        $model = $this->getModel($jenis);
        $permohonan = $model::where('token', $token)->firstOrFail();

        // Upload file hasil if provided
        if ($request->hasFile('file_hasil')) {
            // Delete old file if exists
            if ($permohonan->file_hasil) {
                Storage::disk('public')->delete($permohonan->file_hasil);
            }
            
            $validated['file_hasil'] = $request->file('file_hasil')->store('hasil/' . date('Y/m'), 'public');
        }

        // Update with activity logging (causer will be set automatically by LogsActivity trait)
        $permohonan->update($validated);

        // Add custom activity log for status change
        activity()
            ->causedBy(auth()->user())
            ->performedOn($permohonan)
            ->withProperties([
                'status' => $validated['status'],
                'tanggapan' => $validated['tanggapan'] ?? null,
            ])
            ->log('Status diubah menjadi ' . $validated['status']);

        return redirect()->back()->with('success', 'Permohonan berhasil diupdate');
    }

    private function getModel($jenis)
    {
        return match(strtolower($jenis)) {
            'domisili' => Domisili::class,
            'sktm' => Sktm::class,
            'nikah' => Nikah::class,
            'usaha' => Usaha::class,
            default => abort(404, 'Jenis permohonan tidak ditemukan'),
        };
    }
}
