<?php

namespace App\Http\Controllers;

use App\Models\Layanan;
use App\Notifications\LayananSubmittedNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LayananPublicController extends Controller
{
    public function show($slug)
    {
        $layanan = Layanan::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $kecamatans = \App\Models\Kecamatan::with('desas')->get();

        return Inertia::render('Layanan/Form', [
            'layanan' => $layanan,
            'kecamatans' => $kecamatans,
            'isAuthenticated' => auth()->check(),
        ]);
    }

    public function store(Request $request, $slug)
    {
        if (!auth()->check()) {
            return redirect()->route('login')
                ->with('error', 'Anda harus login terlebih dahulu untuk mengajukan layanan.');
        }

        $layanan = Layanan::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        try {
            $token = null;
            
            if (str_contains($slug, 'domisili')) {
                $token = $this->storeDomisili($request);
            } elseif (str_contains($slug, 'sktm')) {
                $token = $this->storeSktm($request);
            } elseif (str_contains($slug, 'nikah')) {
                $token = $this->storeNikah($request);
            } elseif (str_contains($slug, 'usaha')) {
                $token = $this->storeUsaha($request);
            } else {
                return redirect()->back()->with('error', 'Jenis layanan tidak dikenali.');
            }

            // Send email notification
            auth()->user()->notify(new LayananSubmittedNotification($layanan->nama_layanan, $token));

            // Return success page with token
            return Inertia::render('Layanan/Success', [
                'layanan' => $layanan,
                'token' => $token,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage())->withInput();
        }
    }

    private function storeDomisili(Request $request)
    {
        $validated = $request->validate([
            'kode_kecamatan' => 'required',
            'kode_desa' => 'required',
            'no_pengantar' => 'required',
            'tgl_pengantar' => 'required|date',
            'alamat_domisili' => 'required',
            'ktp' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'kk' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'pengantar' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $files = $this->uploadFiles($request, ['ktp', 'kk', 'pengantar']);
        $token = $this->generateToken();

        \App\Models\Domisili::create(array_merge($validated, $files, [
            'token' => $token,
            'user_id' => auth()->id(),
            'status' => 'pending',
        ]));

        return $token;
    }

    private function storeSktm(Request $request)
    {
        $validated = $request->validate([
            'kode_kecamatan' => 'required',
            'kode_desa' => 'required',
            'no_pengantar' => 'required',
            'tgl_pengantar' => 'required|date',
            'tujuan' => 'required',
            'peruntukan' => 'required',
            'penghasilan' => 'required|numeric',
            'tanggungan' => 'required|numeric',
            
            'ktp' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'kk' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'pengantar' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'pernyataan' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $files = $this->uploadFiles($request, ['ktp', 'kk', 'pengantar', 'pernyataan']);
        $token = $this->generateToken();

        // Prepare data for DB
        $dbData = [
            'token' => $token,
            'kode_kecamatan' => $validated['kode_kecamatan'],
            'kode_desa' => $validated['kode_desa'],
            'no_pengantar' => $validated['no_pengantar'],
            'tgl_pengantar' => $validated['tgl_pengantar'],
            'tujuan' => "{$validated['peruntukan']} (Penghasilan: Rp {$validated['penghasilan']}, Tanggungan: {$validated['tanggungan']})",
            'user_id' => auth()->id(),
            'status' => 'pending',
        ];

        \App\Models\Sktm::create(array_merge($dbData, $files));

        return $token;
    }

    private function storeNikah(Request $request)
    {
        $validated = $request->validate([
            'kode_kecamatan' => 'required',
            'kode_desa' => 'required',
            'no_pengantar' => 'required',
            'tgl_pengantar' => 'required|date',
            
            'calon_mempelai1' => 'required',
            'bin_mempelai1' => 'required',
            'status_mempelai1' => 'required',
            
            'nama_mempelai2' => 'required',
            'calon_mempelai2' => 'required',
            'bin_mempelai2' => 'required',
            'tmp_lahir_mempelai2' => 'required',
            'tgl_lahir_mempelai2' => 'required|date',
            'agama_mempelai2' => 'required',
            'wn_mempelai2' => 'required',
            'pekerjaan_mempelai2' => 'required',
            'status_mempelai2' => 'required',
            'alamat_mempelai2' => 'required',
            
            'hari_nikah' => 'required',
            'tgl_nikah' => 'required|date',
            'alamat_nikah' => 'required',
            'alasan' => 'nullable',
            
            'ktp_pria' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'ktp_wanita' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'bukti_pendaftaran' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $files = $this->uploadFiles($request, ['ktp_pria', 'ktp_wanita', 'bukti_pendaftaran']);
        $token = $this->generateToken();

        \App\Models\Nikah::create(array_merge($validated, $files, [
            'token' => $token,
            'user_id' => auth()->id(),
            'status' => 'pending',
        ]));

        return $token;
    }

    private function storeUsaha(Request $request)
    {
         $validated = $request->validate([
            'kode_kecamatan' => 'required',
            'kode_desa' => 'required',
            'no_pengantar' => 'required',
            'tgl_pengantar' => 'required|date',
            
            'jenis_usaha' => 'required',
            'kegiatan_usaha' => 'required',
            'nama_perusahaan' => 'required',
            'pemilik_usaha' => 'required',
            'alamat_usaha' => 'required',
            
            'ktp' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'sku' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $files = $this->uploadFiles($request, ['ktp', 'sku']);
        $token = $this->generateToken();

        \App\Models\Usaha::create(array_merge($validated, $files, [
            'token' => $token,
            'user_id' => auth()->id(),
            'status' => 'pending',
        ]));

        return $token;
    }

    private function uploadFiles($request, $fields)
    {
        $paths = [];
        foreach ($fields as $field) {
            if ($request->hasFile($field)) {
                $paths[$field] = $request->file($field)->store('uploads/' . date('Y/m'), 'public');
            }
        }
        return $paths;
    }

    private function generateToken()
    {
        do {
            $token = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));
        } while (
            \App\Models\Domisili::where('token', $token)->exists() ||
            \App\Models\Sktm::where('token', $token)->exists() ||
            \App\Models\Nikah::where('token', $token)->exists() ||
            \App\Models\Usaha::where('token', $token)->exists()
        );
        
        return $token;
    }
}

