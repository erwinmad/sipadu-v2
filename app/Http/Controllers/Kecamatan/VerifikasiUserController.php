<?php

namespace App\Http\Controllers\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\DetailUser;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VerifikasiUserController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $kecamatanCode = $user->kode_kecamatan;

        $query = DetailUser::with(['user', 'kecamatan', 'desa'])
            ->when($kecamatanCode, fn($q) => $q->where('kode_kecamatan', $kecamatanCode))
            ->whereNotNull('foto_ktp')
            ->whereNotNull('foto_verifikasi')
            ->latest();

        // Filter by status
        if ($request->filled('status')) {
            $query->where('verification_status', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nik', 'ilike', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'ilike', "%{$search}%")
                        ->orWhere('email', 'ilike', "%{$search}%");
                  });
            });
        }

        $users = $query->paginate(10)->withQueryString();

        // Stats
        $baseQuery = DetailUser::when($kecamatanCode, fn($q) => $q->where('kode_kecamatan', $kecamatanCode))
            ->whereNotNull('foto_ktp')
            ->whereNotNull('foto_verifikasi');

        $stats = [
            'total' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->where('verification_status', 'pending')->count(),
            'verified' => (clone $baseQuery)->where('verification_status', 'verified')->count(),
            'rejected' => (clone $baseQuery)->where('verification_status', 'rejected')->count(),
        ];

        return Inertia::render('Kecamatan/VerifikasiUser/Index', [
            'users' => $users,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show($id)
    {
        $detailUser = DetailUser::with(['user', 'kecamatan', 'desa', 'verifiedByUser'])
            ->findOrFail($id);

        return Inertia::render('Kecamatan/VerifikasiUser/Show', [
            'detailUser' => $detailUser,
        ]);
    }

    public function verify(Request $request, $id)
    {
        $validated = $request->validate([
            'action' => 'required|in:verified,rejected',
            'verification_note' => 'nullable|required_if:action,rejected|string|max:500',
        ]);

        $detailUser = DetailUser::findOrFail($id);

        $detailUser->update([
            'verification_status' => $validated['action'],
            'verification_note' => $validated['verification_note'] ?? null,
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        $statusLabel = $validated['action'] === 'verified' ? 'diverifikasi' : 'ditolak';

        return redirect()->route('kecamatan.verifikasi-user.index')
            ->with('success', "Profil pengguna berhasil {$statusLabel}.");
    }
}
