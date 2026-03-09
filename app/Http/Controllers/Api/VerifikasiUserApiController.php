<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DetailUser;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class VerifikasiUserApiController extends Controller
{
    /**
     * Daftar pengguna yang perlu diverifikasi per kecamatan.
     *
     * GET /api/verifikasi-user?kode_kecamatan=XXX
     *
     * Query params:
     *   - kode_kecamatan (required)
     *   - status (optional): pending|verified|rejected
     *   - search (optional): Cari nama/email/NIK
     *   - per_page (optional): default 15
     *   - page (optional): default 1
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'kode_kecamatan' => 'required|string|exists:kecamatans,id',
            'status' => 'nullable|in:pending,verified,rejected',
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ]);

        $kodeKecamatan = $request->input('kode_kecamatan');
        $status = $request->input('status');
        $search = $request->input('search');
        $perPage = $request->input('per_page', 15);

        $query = DetailUser::with(['user', 'kecamatan', 'desa', 'verifiedByUser'])
            ->where('kode_kecamatan', $kodeKecamatan)
            ->whereNotNull('nik')
            ->whereNotNull('foto_ktp')
            ->whereNotNull('foto_verifikasi');

        if ($status) {
            $query->where('verification_status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nik', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQ) use ($search) {
                      $userQ->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $paginated = $query->latest()->paginate($perPage);

        // Stats
        $baseQuery = DetailUser::where('kode_kecamatan', $kodeKecamatan)
            ->whereNotNull('nik')
            ->whereNotNull('foto_ktp')
            ->whereNotNull('foto_verifikasi');

        $stats = [
            'total' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->where('verification_status', 'pending')->count(),
            'verified' => (clone $baseQuery)->where('verification_status', 'verified')->count(),
            'rejected' => (clone $baseQuery)->where('verification_status', 'rejected')->count(),
        ];

        $data = $paginated->getCollection()->map(function ($detail) {
            return [
                'id' => $detail->id,
                'user_id' => $detail->user_id,
                'name' => $detail->user?->name,
                'email' => $detail->user?->email,
                'nik' => $detail->nik,
                'no_telepon' => $detail->no_telepon,
                'alamat' => $detail->alamat,
                'jenis_kelamin' => $detail->jenis_kelamin,
                'tempat_lahir' => $detail->tempat_lahir,
                'tanggal_lahir' => $detail->tanggal_lahir,
                'pekerjaan' => $detail->pekerjaan,
                'pendidikan_terakhir' => $detail->pendidikan_terakhir,
                'foto_ktp' => $detail->foto_ktp ? asset('storage/' . $detail->foto_ktp) : null,
                'foto_verifikasi' => $detail->foto_verifikasi ? asset('storage/' . $detail->foto_verifikasi) : null,
                'verification_status' => $detail->verification_status,
                'verification_note' => $detail->verification_note,
                'verified_at' => $detail->verified_at?->toISOString(),
                'verified_by' => $detail->verifiedByUser?->name,
                'kecamatan' => $detail->kecamatan?->nama_kecamatan,
                'desa' => $detail->desa?->nama_desa,
                'created_at' => $detail->created_at?->toISOString(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
            'stats' => $stats,
            'pagination' => [
                'current_page' => $paginated->currentPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
                'last_page' => $paginated->lastPage(),
            ],
        ]);
    }

    /**
     * Detail pengguna untuk verifikasi.
     *
     * GET /api/verifikasi-user/{userId}?kode_kecamatan=XXX
     */
    public function show(Request $request, string $userId): JsonResponse
    {
        $request->validate([
            'kode_kecamatan' => 'required|string|exists:kecamatans,id',
        ]);

        $detail = DetailUser::with(['user', 'kecamatan', 'desa', 'verifiedByUser'])
            ->where('user_id', $userId)
            ->where('kode_kecamatan', $request->input('kode_kecamatan'))
            ->first();

        if (!$detail) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemukan di kecamatan ini',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $detail->id,
                'user_id' => $detail->user_id,
                'name' => $detail->user?->name,
                'email' => $detail->user?->email,
                'nik' => $detail->nik,
                'no_telepon' => $detail->no_telepon,
                'alamat' => $detail->alamat,
                'jenis_kelamin' => $detail->jenis_kelamin,
                'tempat_lahir' => $detail->tempat_lahir,
                'tanggal_lahir' => $detail->tanggal_lahir,
                'pekerjaan' => $detail->pekerjaan,
                'pendidikan_terakhir' => $detail->pendidikan_terakhir,
                'foto_ktp' => $detail->foto_ktp ? asset('storage/' . $detail->foto_ktp) : null,
                'foto_verifikasi' => $detail->foto_verifikasi ? asset('storage/' . $detail->foto_verifikasi) : null,
                'verification_status' => $detail->verification_status,
                'verification_note' => $detail->verification_note,
                'verified_at' => $detail->verified_at?->toISOString(),
                'verified_by' => $detail->verifiedByUser?->name,
                'kecamatan' => [
                    'kode' => $detail->kecamatan?->id,
                    'nama' => $detail->kecamatan?->nama_kecamatan,
                ],
                'desa' => [
                    'kode' => $detail->desa?->id,
                    'nama' => $detail->desa?->nama_desa,
                ],
                'created_at' => $detail->created_at?->toISOString(),
            ],
        ]);
    }

    /**
     * Verifikasi atau tolak pengguna.
     *
     * PUT /api/verifikasi-user/{userId}
     *
     * Body:
     *   - kode_kecamatan (required)
     *   - action (required): verify|reject
     *   - note (required if reject): Alasan penolakan
     */
    public function verify(Request $request, string $userId): JsonResponse
    {
        $request->validate([
            'kode_kecamatan' => 'required|string|exists:kecamatans,id',
            'action' => 'required|in:verify,reject',
            'note' => 'required_if:action,reject|nullable|string|max:500',
        ]);

        $detail = DetailUser::with('user')
            ->where('user_id', $userId)
            ->where('kode_kecamatan', $request->input('kode_kecamatan'))
            ->first();

        if (!$detail) {
            return response()->json([
                'success' => false,
                'message' => 'Pengguna tidak ditemukan di kecamatan ini',
            ], 404);
        }

        $action = $request->input('action');

        if ($action === 'verify') {
            $detail->update([
                'verification_status' => 'verified',
                'verification_note' => null,
                'verified_by' => $request->user()->id,
                'verified_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pengguna berhasil diverifikasi',
                'data' => [
                    'user_id' => $detail->user_id,
                    'name' => $detail->user?->name,
                    'verification_status' => 'verified',
                    'verified_at' => now()->toISOString(),
                ],
            ]);
        }

        // Reject
        $detail->update([
            'verification_status' => 'rejected',
            'verification_note' => $request->input('note'),
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pengguna ditolak',
            'data' => [
                'user_id' => $detail->user_id,
                'name' => $detail->user?->name,
                'verification_status' => 'rejected',
                'verification_note' => $request->input('note'),
                'verified_at' => now()->toISOString(),
            ],
        ]);
    }
}
