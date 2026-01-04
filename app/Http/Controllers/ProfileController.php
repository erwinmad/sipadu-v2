<?php

namespace App\Http\Controllers;

use App\Models\DetailUser;
use App\Models\Kecamatan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        $kecamatans = Kecamatan::with('desas')->get();
        
        return Inertia::render('Profile/Complete', [
            'kecamatans' => $kecamatans,
            'detailUser' => auth()->user()->detailUser,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|string|size:16|unique:detail_users,nik,' . (auth()->user()->detailUser->id ?? 'NULL'),
            'no_telepon' => 'required|string|max:15',
            'alamat' => 'required|string',
            'kode_kecamatan' => 'required|exists:kecamatans,id',
            'kode_desa' => 'required',
            'pendidikan_terakhir' => 'required|string',
            'pekerjaan' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'tempat_lahir' => 'nullable|string',
            'jenis_kelamin' => 'nullable|in:L,P',
            'foto_ktp' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'foto_verifikasi' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Validate required files only if profile is not yet complete (new profile)
        $detailUser = auth()->user()->detailUser;
        if (!$detailUser) {
            $request->validate([
                'foto_ktp' => 'required',
                'foto_verifikasi' => 'required',
            ]);
        }

        if ($request->hasFile('foto_ktp')) {
            $validated['foto_ktp'] = $request->file('foto_ktp')->store('ktp', 'public');
        }

        if ($request->hasFile('foto_verifikasi')) {
            $validated['foto_verifikasi'] = $request->file('foto_verifikasi')->store('verifikasi_wajah', 'public');
        }

        $validated['user_id'] = auth()->id();

        DetailUser::updateOrCreate(
            ['user_id' => auth()->id()],
            $validated
        );

        return redirect()->route('dashboard')->with('success', 'Profil berhasil dilengkapi!');
    }
}
