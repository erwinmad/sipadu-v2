# Panduan Integrasi SIMWEB ↔ SIPADU via API

> **Dokumen ini ditujukan untuk Tim Admin/Developer SIMWEB**
> Berisi langkah-langkah lengkap agar SIMWEB dapat mengambil dan mengupdate data permohonan dari SIPADU.

---

## Ringkasan

SIPADU menyediakan REST API yang dilindungi oleh **Laravel Sanctum** (Bearer Token). SIMWEB cukup menggunakan **1 token global** untuk mengakses seluruh data. Data difilter berdasarkan parameter `kode_kecamatan` yang dikirim saat request — sesuai user yang sedang login di SIMWEB.

### Konsep: SIMWEB sebagai Satu-satunya Aplikasi untuk Kecamatan

**Admin kecamatan tidak perlu membuka SIPADU.** Seluruh operasi dilakukan melalui SIMWEB:

| Fitur | Endpoint | Keterangan |
|-------|----------|------------|
| 🏠 **Dashboard** | `GET /api/dashboard` | Statistik, tren, data terbaru — semua dalam 1 call |
| 📋 **Daftar Permohonan** | `GET /api/permohonan` | List permohonan dengan filter & pagination |
| 🔍 **Detail Permohonan** | `GET /api/permohonan/{jenis}/{token}` | Detail lengkap + riwayat aktivitas |
| ✏️ **Update Permohonan** | `PUT /api/permohonan/{jenis}/{token}` | Update status, tanggapan, upload file hasil |
| 📊 **Statistik** | `GET /api/permohonan/statistics` | Statistik global atau per kecamatan |
| 👥 **Daftar User Verifikasi** | `GET /api/verifikasi-user` | List user yang perlu diverifikasi |
| 👤 **Detail User** | `GET /api/verifikasi-user/{userId}` | Detail user + foto KTP & foto live |
| ✅ **Verifikasi/Tolak User** | `PUT /api/verifikasi-user/{userId}` | Verifikasi atau tolak profil pengguna |
| 🗺️ **Daftar Kecamatan** | `GET /api/permohonan/kecamatan` | Referensi kode kecamatan |

### Arsitektur

```
┌─────────────────────────────────────────────────┐
│   SIMWEB (SaaS — semua kecamatan)               │
│                                                  │
│   ✅ Dashboard kecamatan                         │
│   ✅ Kelola permohonan (lihat, update, upload)   │
│   ✅ Verifikasi pengguna (lihat KTP, verify)     │
│   ✅ Statistik & tren bulanan                    │
│                                                  │
│   → 1 Bearer Token global untuk semua kecamatan │
│   → kode_kecamatan dari user login di SIMWEB    │
└───────────────────┬──────────────────────────────┘
                    │
                    │  HTTP Request
                    │  Authorization: Bearer {SATU_TOKEN}
                    │  ?kode_kecamatan=<dari_user_login>
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│   SIPADU (API Provider — sumber data)            │
│                                                  │
│   Menerima token → validasi                     │
│   Menerima kode_kecamatan → filter data         │
│   Return JSON                                   │
└─────────────────────────────────────────────────┘
```

### Cara Kerja

1. User **login di SIMWEB** → user memiliki `kode_kecamatan`
2. SIMWEB panggil **SIPADU API** dengan **1 Bearer Token** + kirim `kode_kecamatan` dari user login sebagai parameter
3. SIPADU **filter data** berdasarkan `kode_kecamatan` yang dikirim
4. SIPADU **return data JSON** ke SIMWEB
5. SIMWEB **tampilkan data** di dashboard — admin kecamatan tidak perlu buka SIPADU

> **Penting**: Hanya dibutuhkan **1 API token** untuk seluruh SIMWEB — bukan 1 token per kecamatan. Token ini akan kami (tim SIPADU) generate dan kirimkan ke Anda.

---

## Langkah 1: Terima Kredensial dari Tim SIPADU

Tim SIPADU akan memberikan 2 informasi berikut:

| Item | Contoh | Keterangan |
|------|--------|------------|
| **API Base URL** | `https://sipadu.cianjurkab.go.id/api` | URL production SIPADU |
| **API Token** | `1\|abc123xyz...` | Token Sanctum, **1 token untuk seluruh SIMWEB** |

> ⚠️ Token ini bersifat rahasia. Jangan commit ke Git. Simpan di `.env`.

---

## Langkah 2: Konfigurasi di SIMWEB

### 2.1 File `.env`

Tambahkan 2 variabel berikut:

```env
SIPADU_API_URL=https://sipadu.cianjurkab.go.id/api
SIPADU_API_TOKEN=token-yang-diberikan-tim-sipadu
```

### 2.2 File `config/services.php`

Tambahkan entry baru:

```php
'sipadu' => [
    'url' => env('SIPADU_API_URL'),
    'token' => env('SIPADU_API_TOKEN'),
],
```

Setelah menambahkan config, jalankan:

```bash
php artisan config:clear
```

---

## Langkah 3: Buat Service Class

Buat file `app/Services/SipaduService.php`:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;

class SipaduService
{
    protected string $baseUrl;
    protected string $token;

    public function __construct()
    {
        $this->baseUrl = config('services.sipadu.url');
        $this->token = config('services.sipadu.token');
    }

    // =============================================
    // DASHBOARD
    // =============================================

    /**
     * Dashboard kecamatan — semua data dalam 1 call.
     * Cocok untuk halaman utama SIMWEB.
     */
    public function getDashboard(string $kodeKecamatan): ?array
    {
        try {
            $response = Http::withToken($this->token)
                ->get("{$this->baseUrl}/dashboard", [
                    'kode_kecamatan' => $kodeKecamatan,
                ]);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('SIPADU API Error [getDashboard]: ' . $e->getMessage());
            return null;
        }
    }

    // =============================================
    // PERMOHONAN
    // =============================================

    /**
     * Daftar kecamatan (untuk dropdown/referensi).
     */
    public function getKecamatan(): ?array
    {
        try {
            $response = Http::withToken($this->token)
                ->get("{$this->baseUrl}/permohonan/kecamatan");

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('SIPADU API Error [getKecamatan]: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Semua permohonan untuk kecamatan tertentu.
     *
     * @param string $kodeKecamatan  Kode kecamatan user yang login di SIMWEB
     * @param array  $filters        ['status', 'jenis', 'search', 'per_page', 'page']
     */
    public function getPermohonan(string $kodeKecamatan, array $filters = []): ?array
    {
        try {
            $response = Http::withToken($this->token)
                ->get("{$this->baseUrl}/permohonan", array_merge(
                    ['kode_kecamatan' => $kodeKecamatan],
                    $filters
                ));

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('SIPADU API Error [getPermohonan]: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Statistik permohonan.
     *
     * @param string|null $kodeKecamatan  Jika null, return statistik global
     */
    public function getStatistics(?string $kodeKecamatan = null): ?array
    {
        try {
            $params = $kodeKecamatan ? ['kode_kecamatan' => $kodeKecamatan] : [];
            $response = Http::withToken($this->token)
                ->get("{$this->baseUrl}/permohonan/statistics", $params);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('SIPADU API Error [getStatistics]: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Detail 1 permohonan.
     */
    public function getPermohonanDetail(string $kodeKecamatan, string $jenis, string $token): ?array
    {
        try {
            $response = Http::withToken($this->token)
                ->get("{$this->baseUrl}/permohonan/{$jenis}/{$token}", [
                    'kode_kecamatan' => $kodeKecamatan,
                ]);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('SIPADU API Error [getDetail]: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Update permohonan (status, tanggapan, file).
     */
    public function updatePermohonan(string $kodeKecamatan, string $jenis, string $token, array $data): ?array
    {
        try {
            $request = Http::withToken($this->token);

            // Handle file upload via multipart
            if (isset($data['file_hasil']) && $data['file_hasil'] instanceof UploadedFile) {
                $request = $request->attach(
                    'file_hasil',
                    file_get_contents($data['file_hasil']->getRealPath()),
                    $data['file_hasil']->getClientOriginalName()
                );
                unset($data['file_hasil']);
            }

            $response = $request->put(
                "{$this->baseUrl}/permohonan/{$jenis}/{$token}",
                array_merge(['kode_kecamatan' => $kodeKecamatan], $data)
            );

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('SIPADU API Error [update]: ' . $e->getMessage());
            return null;
        }
    }

    // =============================================
    // VERIFIKASI PENGGUNA
    // =============================================

    /**
     * Daftar pengguna yang perlu diverifikasi.
     *
     * @param string $kodeKecamatan  Kecamatan user login di SIMWEB
     * @param array  $filters        ['status', 'search', 'per_page', 'page']
     */
    public function getVerifikasiUsers(string $kodeKecamatan, array $filters = []): ?array
    {
        try {
            $response = Http::withToken($this->token)
                ->get("{$this->baseUrl}/verifikasi-user", array_merge(
                    ['kode_kecamatan' => $kodeKecamatan],
                    $filters
                ));

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('SIPADU API Error [getVerifikasiUsers]: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Detail pengguna untuk verifikasi.
     */
    public function getVerifikasiUserDetail(string $kodeKecamatan, string $userId): ?array
    {
        try {
            $response = Http::withToken($this->token)
                ->get("{$this->baseUrl}/verifikasi-user/{$userId}", [
                    'kode_kecamatan' => $kodeKecamatan,
                ]);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('SIPADU API Error [getVerifikasiDetail]: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Verifikasi atau tolak pengguna.
     *
     * @param string $action  'verify' atau 'reject'
     * @param string|null $note  Alasan penolakan (wajib jika reject)
     */
    public function verifyUser(string $kodeKecamatan, string $userId, string $action, ?string $note = null): ?array
    {
        try {
            $response = Http::withToken($this->token)
                ->put("{$this->baseUrl}/verifikasi-user/{$userId}", [
                    'kode_kecamatan' => $kodeKecamatan,
                    'action' => $action,
                    'note' => $note,
                ]);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('SIPADU API Error [verifyUser]: ' . $e->getMessage());
            return null;
        }
    }
}
```

---

## Langkah 4: Contoh Penggunaan di Controller

### Contoh Controller Dashboard

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SipaduService;

class DashboardController extends Controller
{
    public function __construct(
        protected SipaduService $sipaduService
    ) {}

    public function index()
    {
        $kodeKecamatan = auth()->user()->kode_kecamatan;

        $dashboard = $this->sipaduService->getDashboard($kodeKecamatan);

        return view('admin.dashboard', [
            'kecamatan' => $dashboard['kecamatan'] ?? [],
            'permohonan' => $dashboard['permohonan'] ?? [],
            'verifikasi' => $dashboard['verifikasi'] ?? [],
        ]);
    }
}
```

### Contoh Controller Permohonan

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SipaduService;
use Illuminate\Http\Request;

class PermohonanController extends Controller
{
    public function __construct(
        protected SipaduService $sipaduService
    ) {}

    /**
     * Daftar permohonan — data difilter berdasarkan kecamatan user yang login.
     */
    public function index(Request $request)
    {
        // Ambil kode_kecamatan dari user yang sedang login di SIMWEB
        $kodeKecamatan = auth()->user()->kode_kecamatan;

        $permohonan = $this->sipaduService->getPermohonan($kodeKecamatan, [
            'per_page' => 20,
            'page' => $request->input('page', 1),
            'status' => $request->input('status'),
            'jenis' => $request->input('jenis'),
            'search' => $request->input('search'),
        ]);

        return view('admin.permohonan.index', [
            'permohonan' => $permohonan['data'] ?? [],
            'stats' => $permohonan['stats'] ?? [],
            'pagination' => $permohonan['pagination'] ?? [],
        ]);
    }

    /**
     * Detail 1 permohonan.
     */
    public function show($jenis, $token)
    {
        $kodeKecamatan = auth()->user()->kode_kecamatan;

        $result = $this->sipaduService->getPermohonanDetail($kodeKecamatan, $jenis, $token);

        if (!$result || !$result['success']) {
            return redirect()->back()->with('error', 'Permohonan tidak ditemukan');
        }

        return view('admin.permohonan.show', [
            'permohonan' => $result['data'],
            'activities' => $result['activities'] ?? [],
            'jenis' => $jenis,
        ]);
    }

    /**
     * Update status permohonan.
     */
    public function update(Request $request, $jenis, $token)
    {
        $kodeKecamatan = auth()->user()->kode_kecamatan;

        $validated = $request->validate([
            'status' => 'sometimes|required|in:pending,proses,selesai,ditolak',
            'tanggapan' => 'nullable|string',
            'file_hasil' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        $result = $this->sipaduService->updatePermohonan($kodeKecamatan, $jenis, $token, $validated);

        if (!$result || !$result['success']) {
            return redirect()->back()->with('error', 'Gagal update permohonan');
        }

        return redirect()->back()->with('success', 'Permohonan berhasil diupdate');
    }
}
```

### Contoh Controller Verifikasi Pengguna

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SipaduService;
use Illuminate\Http\Request;

class VerifikasiController extends Controller
{
    public function __construct(
        protected SipaduService $sipaduService
    ) {}

    public function index(Request $request)
    {
        $kodeKecamatan = auth()->user()->kode_kecamatan;

        $result = $this->sipaduService->getVerifikasiUsers($kodeKecamatan, [
            'status' => $request->input('status'),
            'search' => $request->input('search'),
            'per_page' => 20,
        ]);

        return view('admin.verifikasi.index', [
            'users' => $result['data'] ?? [],
            'stats' => $result['stats'] ?? [],
            'pagination' => $result['pagination'] ?? [],
        ]);
    }

    public function show($userId)
    {
        $kodeKecamatan = auth()->user()->kode_kecamatan;

        $result = $this->sipaduService->getVerifikasiUserDetail($kodeKecamatan, $userId);

        if (!$result || !$result['success']) {
            return redirect()->back()->with('error', 'Pengguna tidak ditemukan');
        }

        return view('admin.verifikasi.show', [
            'user' => $result['data'],
        ]);
    }

    public function verify(Request $request, $userId)
    {
        $kodeKecamatan = auth()->user()->kode_kecamatan;
        $action = $request->input('action'); // 'verify' atau 'reject'
        $note = $request->input('note');     // alasan jika reject

        $result = $this->sipaduService->verifyUser($kodeKecamatan, $userId, $action, $note);

        if (!$result || !$result['success']) {
            return redirect()->back()->with('error', 'Gagal memproses verifikasi');
        }

        return redirect()->back()->with('success', $result['message'] ?? 'Berhasil');
    }
}
```

---

## Referensi API Endpoints

Semua endpoint dilindungi `auth:sanctum`. Setiap request wajib menyertakan header:

```
Authorization: Bearer {token}
Accept: application/json
```

### 1. Dashboard Kecamatan

Semua data statistik dan terbaru dalam 1 *call*.

```
GET /api/dashboard?kode_kecamatan=KEC001
```

**Response:**
```json
{
    "success": true,
    "kecamatan": {
        "kode": "KEC001",
        "nama": "Cipanas"
    },
    "permohonan": {
        "total": 100,
        "by_status": {
            "pending": 25,
            "proses": 30,
            "selesai": 40,
            "ditolak": 5
        },
        "by_type": [
            { "name": "Domisili", "value": 30 },
            { "name": "SKTM", "value": 40 },
            { "name": "Nikah", "value": 20 },
            { "name": "Usaha", "value": 10 }
        ],
        "monthly_trend": [
            { "name": "Okt 25", "Domisili": 5, "SKTM": 8, "Nikah": 2, "Usaha": 1 },
            ...
        ],
        "recent": [
            {
                "id": 1,
                "token": "abc123xyz",
                "status": "pending",
                "created_at": "2026-03-09T10:00:00.000000Z",
                "jenis": "Domisili",
                "user_name": "John Doe",
                "desa": "Cipanas Barat"
            }
        ]
    },
    "verifikasi": {
        "stats": {
            "total": 50,
            "pending": 10,
            "verified": 35,
            "rejected": 5
        },
        "pending_users": [
            {
                "user_id": "uuid-xxx",
                "name": "Jane Doe",
                "email": "jane@example.com",
                "nik": "3203xxxx",
                "created_at": "2026-03-09T09:00:00.000000Z"
            }
        ]
    }
}
```

---

### 2. Daftar Kecamatan

```
GET /api/permohonan/kecamatan
```

**Response:**
```json
{
    "success": true,
    "data": [
        { "id": "KEC001", "nama_kecamatan": "Cipanas" },
        { "id": "KEC002", "nama_kecamatan": "Pacet" }
    ]
}
```

---

### 2. Daftar Permohonan

```
GET /api/permohonan?kode_kecamatan=KEC001
```

**Parameter:**

| Param | Wajib | Keterangan |
|-------|-------|------------|
| `kode_kecamatan` | ✅ Ya | Kode kecamatan dari user yang login |
| `status` | Tidak | `pending` / `proses` / `selesai` / `ditolak` |
| `jenis` | Tidak | `domisili` / `sktm` / `nikah` / `usaha` |
| `search` | Tidak | Pencarian berdasarkan nama_lengkap |
| `per_page` | Tidak | Jumlah per halaman (default: 15) |
| `page` | Tidak | Nomor halaman (default: 1) |

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "token": "abc123",
            "nama_lengkap": "John Doe",
            "nik": "1234567890123456",
            "status": "pending",
            "jenis": "SKTM",
            "kode_kecamatan": "KEC001",
            "created_at": "2026-02-15T10:00:00.000000Z",
            "kecamatan": { "id": "KEC001", "nama_kecamatan": "Cipanas" },
            "desa": { "id": "DES001", "nama_desa": "Cipanas Barat" }
        }
    ],
    "stats": {
        "total": 100,
        "pending": 25,
        "proses": 30,
        "selesai": 40,
        "ditolak": 5
    },
    "pagination": {
        "current_page": 1,
        "per_page": 15,
        "total": 100,
        "last_page": 7
    }
}
```

---

### 3. Statistik

```
GET /api/permohonan/statistics
GET /api/permohonan/statistics?kode_kecamatan=KEC001
```

**Tanpa parameter** → statistik seluruh kecamatan:
```json
{
    "success": true,
    "data": {
        "global": { "total": 500, "pending": 100, "proses": 150, "selesai": 200, "ditolak": 50 },
        "per_kecamatan": [
            { "kode": "KEC001", "nama": "Cipanas", "total": 100, "pending": 25, "proses": 30, "selesai": 40, "ditolak": 5 }
        ]
    }
}
```

**Dengan kode_kecamatan** → statistik 1 kecamatan:
```json
{
    "success": true,
    "data": {
        "total": 100,
        "pending": 25,
        "proses": 30,
        "selesai": 40,
        "ditolak": 5,
        "by_jenis": { "domisili": 30, "sktm": 40, "nikah": 20, "usaha": 10 }
    }
}
```

---

### 4. Detail Permohonan

```
GET /api/permohonan/{jenis}/{token}?kode_kecamatan=KEC001
```

`{jenis}` = `domisili` / `sktm` / `nikah` / `usaha`

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "token": "abc123",
        "nama_lengkap": "John Doe",
        "status": "pending",
        "jenis": "SKTM"
    },
    "activities": [
        {
            "id": 1,
            "description": "Permohonan diupdate dari SIMWEB",
            "properties": { "status": "proses", "updated_via": "SIMWEB API" },
            "created_at": "2026-02-15T10:00:00.000000Z",
            "causer": { "name": "Admin", "email": "admin@kec.go.id" }
        }
    ]
}
```

---

### 5. Update Permohonan

```
PUT /api/permohonan/{jenis}/{token}
```

**Body (form-data / JSON):**

| Field | Wajib | Keterangan |
|-------|-------|------------|
| `kode_kecamatan` | ✅ Ya | Kode kecamatan (access control) |
| `status` | Tidak | `pending` / `proses` / `selesai` / `ditolak` |
| `tanggapan` | Tidak | Teks tanggapan |
| `file_hasil` | Tidak | File PDF, max 5MB |

**Response:**
```json
{
    "success": true,
    "message": "Permohonan berhasil diupdate",
    "data": { "id": 1, "status": "proses", "tanggapan": "Sedang diproses" }
}
```

---

### 6. Daftar Pengguna untuk Verifikasi

```
GET /api/verifikasi-user?kode_kecamatan=KEC001
```

**Parameter:**

| Param | Wajib | Keterangan |
|-------|-------|------------|
| `kode_kecamatan` | ✅ Ya | Kode kecamatan |
| `status` | Tidak | `pending` / `verified` / `rejected` |
| `search` | Tidak | Cari berdasarkan nama/email/NIK |
| `per_page` | Tidak | Default: 15 |
| `page` | Tidak | Default: 1 |

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "user_id": "uuid-xxx",
            "name": "John Doe",
            "email": "john@example.com",
            "nik": "3203xxxxxxxxxx",
            "no_telepon": "08123456789",
            "alamat": "Jl. Raya No. 1",
            "foto_ktp": "https://sipadu.cianjurkab.go.id/storage/ktp/xxx.jpg",
            "foto_verifikasi": "https://sipadu.cianjurkab.go.id/storage/verifikasi/xxx.jpg",
            "verification_status": "pending",
            "verification_note": null,
            "verified_at": null,
            "verified_by": null,
            "kecamatan": "Cipanas",
            "desa": "Cipanas Barat",
            "created_at": "2026-03-09T10:00:00.000000Z"
        }
    ],
    "stats": {
        "total": 50,
        "pending": 10,
        "verified": 35,
        "rejected": 5
    },
    "pagination": {
        "current_page": 1,
        "per_page": 15,
        "total": 50,
        "last_page": 4
    }
}
```

---

### 7. Detail Pengguna untuk Verifikasi

```
GET /api/verifikasi-user/{userId}?kode_kecamatan=KEC001
```

**Response:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "user_id": "uuid-xxx",
        "name": "John Doe",
        "email": "john@example.com",
        "nik": "3203xxxxxxxxxx",
        "no_telepon": "08123456789",
        "alamat": "Jl. Raya No. 1",
        "jenis_kelamin": "L",
        "tempat_lahir": "Cianjur",
        "tanggal_lahir": "1990-01-15",
        "pekerjaan": "Wiraswasta",
        "pendidikan_terakhir": "S1",
        "foto_ktp": "https://sipadu.cianjurkab.go.id/storage/ktp/xxx.jpg",
        "foto_verifikasi": "https://sipadu.cianjurkab.go.id/storage/verifikasi/xxx.jpg",
        "verification_status": "pending",
        "verification_note": null,
        "verified_at": null,
        "verified_by": null,
        "kecamatan": { "kode": "KEC001", "nama": "Cipanas" },
        "desa": { "kode": "DES001", "nama": "Cipanas Barat" },
        "created_at": "2026-03-09T10:00:00.000000Z"
    }
}
```

---

### 8. Verifikasi / Tolak Pengguna

```
PUT /api/verifikasi-user/{userId}
```

**Body (JSON):**

| Field | Wajib | Keterangan |
|-------|-------|------------|
| `kode_kecamatan` | ✅ Ya | Kode kecamatan (access control) |
| `action` | ✅ Ya | `verify` atau `reject` |
| `note` | Wajib jika reject | Alasan penolakan (max 500 karakter) |

**Contoh body verifikasi:**
```json
{
    "kode_kecamatan": "KEC001",
    "action": "verify"
}
```

**Contoh body penolakan:**
```json
{
    "kode_kecamatan": "KEC001",
    "action": "reject",
    "note": "Foto KTP tidak jelas, mohon upload ulang"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Pengguna berhasil diverifikasi",
    "data": {
        "user_id": "uuid-xxx",
        "name": "John Doe",
        "verification_status": "verified",
        "verified_at": "2026-03-09T10:30:00.000000Z"
    }
}
```

---

## Testing dengan cURL

Contoh-contoh berikut bisa digunakan untuk menguji koneksi. Ganti `YOUR_TOKEN` dengan token yang diberikan tim SIPADU.

```bash
# 1. Cek koneksi — daftar kecamatan
curl -X GET "https://sipadu.cianjurkab.go.id/api/permohonan/kecamatan" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# 2. Ambil permohonan kecamatan Cipanas
curl -X GET "https://sipadu.cianjurkab.go.id/api/permohonan?kode_kecamatan=KEC001" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# 3. Statistik 1 kecamatan
curl -X GET "https://sipadu.cianjurkab.go.id/api/permohonan/statistics?kode_kecamatan=KEC001" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# 4. Update status permohonan
curl -X PUT "https://sipadu.cianjurkab.go.id/api/permohonan/sktm/abc123" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"kode_kecamatan":"KEC001","status":"proses","tanggapan":"Sedang diproses"}'

# 5. Update dengan file PDF
curl -X PUT "https://sipadu.cianjurkab.go.id/api/permohonan/sktm/abc123" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json" \
  -F "kode_kecamatan=KEC001" \
  -F "status=selesai" \
  -F "tanggapan=Selesai diproses" \
  -F "file_hasil=@/path/to/hasil.pdf"

# 6. Daftar pengguna menunggu verifikasi
curl -X GET "https://sipadu.cianjurkab.go.id/api/verifikasi-user?kode_kecamatan=KEC001" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# 7. Detail pengguna
curl -X GET "https://sipadu.cianjurkab.go.id/api/verifikasi-user/USER_UUID?kode_kecamatan=KEC001" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"

# 8. Verifikasi pengguna
curl -X PUT "https://sipadu.cianjurkab.go.id/api/verifikasi-user/USER_UUID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"kode_kecamatan":"KEC001","action":"verify"}'

# 9. Tolak pengguna
curl -X PUT "https://sipadu.cianjurkab.go.id/api/verifikasi-user/USER_UUID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"kode_kecamatan":"KEC001","action":"reject","note":"Foto KTP tidak jelas"}'
```

---

## FAQ

### Apakah setiap kecamatan perlu token sendiri?

**Tidak.** SIMWEB cukup menggunakan **1 token global**. Data difilter berdasarkan `kode_kecamatan` yang dikirim sebagai parameter request — bukan dari token.

Alurnya:
```
User login di SIMWEB → punya kode_kecamatan
→ SIMWEB kirim request ke SIPADU dengan 1 token + kode_kecamatan sebagai parameter
→ SIPADU return data yang sudah difilter
```

### Bagaimana mendapatkan daftar kode_kecamatan yang valid?

Gunakan endpoint `GET /api/permohonan/kecamatan` untuk mendapatkan daftar lengkap kode dan nama kecamatan. Cocokkan dengan data user di SIMWEB.

### Bagaimana jika token expired atau tidak valid?

API akan mengembalikan `401 Unauthorized`. Hubungi tim SIPADU untuk mendapatkan token baru.

### Apakah perlu mapping kode_kecamatan?

Ya. Pastikan `kode_kecamatan` yang digunakan di SIMWEB **sama persis** dengan yang ada di database SIPADU. Gunakan endpoint daftar kecamatan untuk melihat kode yang valid.

---

## Troubleshooting

| HTTP Code | Error | Penyebab | Solusi |
|-----------|-------|----------|--------|
| `401` | Unauthorized | Token tidak valid / expired | Hubungi tim SIPADU untuk token baru |
| `403` | Forbidden | Akses ditolak | Cek token masih aktif |
| `404` | Not Found | Token permohonan / jenis salah | Cek `{jenis}` dan `{token}` di URL |
| `422` | Validation Error | Parameter tidak lengkap | Pastikan `kode_kecamatan` selalu dikirim |
| `500` | Server Error | Error di server SIPADU | Hubungi tim SIPADU |

---

## Kontak Tim SIPADU

Jika ada pertanyaan atau kendala teknis:

- **Email**: diskominfo@cianjurkab.go.id
- **Request token baru**: hubungi admin SIPADU

---

*Dokumen ini terakhir diperbarui: 9 Maret 2026*
