<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domisili;
use App\Models\Kecamatan;
use App\Models\Sktm;
use App\Models\Nikah;
use App\Models\Usaha;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class PermohonanApiController extends Controller
{
    /**
     * Resolve kode_kecamatan dari request parameter.
     * SIMWEB mengirim kode_kecamatan milik user yang sedang login di sisi SIMWEB.
     */
    private function resolveKecamatan(string $kodeKecamatan): ?Kecamatan
    {
        return Kecamatan::where('id', $kodeKecamatan)->first();
    }

    /**
     * Daftar semua kecamatan (untuk dropdown/referensi di SIMWEB).
     *
     * GET /api/permohonan/kecamatan
     */
    public function kecamatanList(): JsonResponse
    {
        $kecamatans = Kecamatan::orderBy('nama_kecamatan')->get(['id', 'nama_kecamatan']);

        return response()->json([
            'success' => true,
            'data' => $kecamatans,
        ]);
    }

    /**
     * Semua permohonan untuk kecamatan tertentu.
     *
     * GET /api/permohonan?kode_kecamatan=XXX
     *
     * Query params:
     *   - kode_kecamatan (required): Kode kecamatan
     *   - status (optional): pending|proses|selesai|ditolak
     *   - jenis (optional): domisili|sktm|nikah|usaha
     *   - search (optional): Cari berdasarkan nama_lengkap
     *   - per_page (optional): Jumlah per halaman (default: 15)
     *   - page (optional): Nomor halaman (default: 1)
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'kode_kecamatan' => 'required|string|exists:kecamatans,id',
            'status' => 'nullable|in:pending,proses,selesai,ditolak',
            'jenis' => 'nullable|in:domisili,sktm,nikah,usaha',
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ]);

        $kecamatan = $this->resolveKecamatan($request->input('kode_kecamatan'));

        $status = $request->input('status');
        $jenis = $request->input('jenis');
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $page = $request->input('page', 1);

        $permohonan = $this->getAllPermohonan($kecamatan->id, $status, $jenis, $search);

        // Hitung statistik
        $stats = [
            'total' => $permohonan->count(),
            'pending' => $permohonan->where('status', 'pending')->count(),
            'proses' => $permohonan->where('status', 'proses')->count(),
            'selesai' => $permohonan->where('status', 'selesai')->count(),
            'ditolak' => $permohonan->where('status', 'ditolak')->count(),
        ];

        // Manual pagination
        $offset = ($page - 1) * $perPage;
        $paginatedData = $permohonan->slice($offset, $perPage)->values();

        return response()->json([
            'success' => true,
            'data' => $paginatedData,
            'stats' => $stats,
            'pagination' => [
                'current_page' => (int) $page,
                'per_page' => (int) $perPage,
                'total' => $permohonan->count(),
                'last_page' => (int) ceil($permohonan->count() / $perPage),
            ],
            'kecamatan' => [
                'kode' => $kecamatan->id,
                'nama' => $kecamatan->nama_kecamatan,
            ],
        ]);
    }

    /**
     * Statistik permohonan.
     *
     * GET /api/permohonan/statistics?kode_kecamatan=XXX  → stats per kecamatan
     * GET /api/permohonan/statistics                      → stats global semua kecamatan
     */
    public function statistics(Request $request): JsonResponse
    {
        $kodeKecamatan = $request->input('kode_kecamatan');

        // Jika kode_kecamatan diberikan → stats untuk kecamatan itu saja
        if ($kodeKecamatan) {
            $request->validate([
                'kode_kecamatan' => 'string|exists:kecamatans,id',
            ]);

            $kecamatan = $this->resolveKecamatan($kodeKecamatan);
            $permohonan = $this->getAllPermohonan($kecamatan->id);

            return response()->json([
                'success' => true,
                'data' => [
                    'total' => $permohonan->count(),
                    'pending' => $permohonan->where('status', 'pending')->count(),
                    'proses' => $permohonan->where('status', 'proses')->count(),
                    'selesai' => $permohonan->where('status', 'selesai')->count(),
                    'ditolak' => $permohonan->where('status', 'ditolak')->count(),
                    'by_jenis' => [
                        'domisili' => $permohonan->where('jenis', 'Domisili')->count(),
                        'sktm' => $permohonan->where('jenis', 'SKTM')->count(),
                        'nikah' => $permohonan->where('jenis', 'Nikah')->count(),
                        'usaha' => $permohonan->where('jenis', 'Usaha')->count(),
                    ],
                ],
                'kecamatan' => [
                    'kode' => $kecamatan->id,
                    'nama' => $kecamatan->nama_kecamatan,
                ],
            ]);
        }

        // Tanpa kode_kecamatan → statistik global semua kecamatan
        $allKecamatans = Kecamatan::orderBy('nama_kecamatan')->get();
        $overview = [];

        foreach ($allKecamatans as $kec) {
            $permohonan = $this->getAllPermohonan($kec->id);
            $overview[] = [
                'kode' => $kec->id,
                'nama' => $kec->nama_kecamatan,
                'total' => $permohonan->count(),
                'pending' => $permohonan->where('status', 'pending')->count(),
                'proses' => $permohonan->where('status', 'proses')->count(),
                'selesai' => $permohonan->where('status', 'selesai')->count(),
                'ditolak' => $permohonan->where('status', 'ditolak')->count(),
            ];
        }

        $totalAll = collect($overview);

        return response()->json([
            'success' => true,
            'data' => [
                'global' => [
                    'total' => $totalAll->sum('total'),
                    'pending' => $totalAll->sum('pending'),
                    'proses' => $totalAll->sum('proses'),
                    'selesai' => $totalAll->sum('selesai'),
                    'ditolak' => $totalAll->sum('ditolak'),
                ],
                'per_kecamatan' => $overview,
            ],
        ]);
    }

    /**
     * Detail permohonan berdasarkan jenis dan token.
     *
     * GET /api/permohonan/{jenis}/{token}?kode_kecamatan=XXX
     */
    public function show(Request $request, string $jenis, string $token): JsonResponse
    {
        $request->validate([
            'kode_kecamatan' => 'required|string|exists:kecamatans,id',
        ]);

        $kecamatan = $this->resolveKecamatan($request->input('kode_kecamatan'));

        $model = $this->getModel($jenis);

        if (!$model) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis permohonan tidak valid. Gunakan: domisili, sktm, nikah, usaha',
            ], 404);
        }

        $permohonan = $model::with(['user', 'kecamatan', 'desa'])
            ->where('token', $token)
            ->where('kode_kecamatan', $kecamatan->id)
            ->first();

        if (!$permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan tidak ditemukan',
            ], 404);
        }

        // Activity logs
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

        return response()->json([
            'success' => true,
            'data' => array_merge($permohonan->toArray(), ['jenis' => ucfirst($jenis)]),
            'activities' => $activities,
        ]);
    }

    /**
     * Update status, tanggapan, dan file hasil permohonan.
     *
     * PUT/PATCH /api/permohonan/{jenis}/{token}
     *
     * Body params:
     *   - kode_kecamatan (required): Kode kecamatan untuk access control
     *   - status (optional): pending|proses|selesai|ditolak
     *   - tanggapan (optional): string
     *   - file_hasil (optional): PDF file, max 5MB
     */
    public function update(Request $request, string $jenis, string $token): JsonResponse
    {
        $request->validate([
            'kode_kecamatan' => 'required|string|exists:kecamatans,id',
        ]);

        $kecamatan = $this->resolveKecamatan($request->input('kode_kecamatan'));

        $model = $this->getModel($jenis);

        if (!$model) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis permohonan tidak valid. Gunakan: domisili, sktm, nikah, usaha',
            ], 404);
        }

        $permohonan = $model::where('token', $token)
            ->where('kode_kecamatan', $kecamatan->id)
            ->first();

        if (!$permohonan) {
            return response()->json([
                'success' => false,
                'message' => 'Permohonan tidak ditemukan',
            ], 404);
        }

        // Validasi field update
        $validated = $request->validate([
            'status' => 'sometimes|required|in:pending,proses,selesai,ditolak',
            'tanggapan' => 'nullable|string',
            'file_hasil' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        // Handle file upload
        if ($request->hasFile('file_hasil')) {
            // Hapus file lama jika ada
            if ($permohonan->file_hasil) {
                Storage::disk('public')->delete($permohonan->file_hasil);
            }

            $validated['file_hasil'] = $request->file('file_hasil')
                ->store('hasil/' . date('Y/m'), 'public');
        }

        // Update permohonan
        $permohonan->update($validated);

        // Log activity
        $user = $request->user();
        activity()
            ->causedBy($user)
            ->performedOn($permohonan)
            ->withProperties([
                'status' => $validated['status'] ?? $permohonan->status,
                'tanggapan' => $validated['tanggapan'] ?? null,
                'updated_via' => 'SIMWEB API',
                'kecamatan' => $kecamatan->nama_kecamatan,
            ])
            ->log('Permohonan diupdate dari SIMWEB');

        return response()->json([
            'success' => true,
            'message' => 'Permohonan berhasil diupdate',
            'data' => $permohonan->fresh()->load(['user', 'kecamatan', 'desa']),
        ]);
    }

    /**
     * Ambil semua permohonan dari semua tabel untuk kecamatan tertentu.
     */
    private function getAllPermohonan(
        string $kodeKecamatan,
        ?string $status = null,
        ?string $jenis = null,
        ?string $search = null
    ) {
        $tables = [
            'Domisili' => Domisili::class,
            'SKTM' => Sktm::class,
            'Nikah' => Nikah::class,
            'Usaha' => Usaha::class,
        ];

        $permohonan = collect();

        foreach ($tables as $jenisLabel => $modelClass) {
            $items = $modelClass::with(['user', 'kecamatan', 'desa'])
                ->where('kode_kecamatan', $kodeKecamatan)
                ->when($status, fn($q) => $q->where('status', $status))
                ->when($search, fn($q) => $q->where('nama_lengkap', 'ilike', "%{$search}%"))
                ->latest()
                ->get()
                ->map(fn($item) => array_merge($item->toArray(), ['jenis' => $jenisLabel]));

            $permohonan = $permohonan->merge($items);
        }

        if ($jenis) {
            $permohonan = $permohonan->where('jenis', ucfirst($jenis));
        }

        return $permohonan->sortByDesc('created_at')->values();
    }

    /**
     * Resolve model class berdasarkan jenis permohonan.
     */
    private function getModel(string $jenis): ?string
    {
        return match (strtolower($jenis)) {
            'domisili' => Domisili::class,
            'sktm' => Sktm::class,
            'nikah' => Nikah::class,
            'usaha' => Usaha::class,
            default => null,
        };
    }
}
