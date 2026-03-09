<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Domisili;
use App\Models\Sktm;
use App\Models\Nikah;
use App\Models\Usaha;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermohonanController extends Controller
{
    public function show($jenis, $token)
    {
        $model = $this->getModel($jenis);
        $permohonan = $model::with(['kecamatan', 'desa'])
            ->where('token', $token)
            ->where('user_id', auth()->id()) // Pastikan milik user yang login
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

        return Inertia::render('User/Permohonan/Show', [
            'permohonan' => $permohonan,
            'jenis' => $jenis,
            'activities' => $activities,
        ]);
    }

    public function destroyDocuments($jenis, $token)
    {
        $model = $this->getModel($jenis);
        $permohonan = $model::where('token', $token)
            ->where('user_id', auth()->id()) // Ensure user owns this
            ->firstOrFail();

        $documentConfigs = [
            'domisili' => ['ktp', 'kk', 'pengantar'],
            'sktm' => ['ktp', 'kk', 'pengantar', 'pernyataan'],
            'nikah' => ['ktp_pria', 'ktp_wanita', 'bukti_pendaftaran'],
            'usaha' => ['ktp', 'sku'],
        ];

        $jenisKey = strtolower($jenis);
        $docsToClear = $documentConfigs[$jenisKey] ?? [];

        $cleared = false;
        foreach ($docsToClear as $docField) {
            if ($permohonan->$docField) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($permohonan->$docField);
                $permohonan->$docField = null;
                $cleared = true;
            }
        }

        if ($cleared) {
            $permohonan->save();
            
            activity()
                ->causedBy(auth()->user())
                ->performedOn($permohonan)
                ->log('Dokumen persyaratan telah dihapus oleh Pemohon');
                
            return redirect()->back()->with('success', 'Dokumen persyaratan berhasil dihapus');
        }

        return redirect()->back()->with('success', 'Tidak ada dokumen yang perlu dihapus');
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
