<?php

namespace App\Http\Controllers\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\DetailKecamatan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileKecamatanController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        $detailKecamatan = DetailKecamatan::where('kode_kecamatan', $user->kode_kecamatan)->first();

        return Inertia::render('Kecamatan/Profile/Edit', [
            'detailKecamatan' => $detailKecamatan,
            'kecamatan' => $user->kecamatan,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'alamat_kantor' => 'required|string',
            'no_telepon' => 'required|string|max:15',
            'email' => 'nullable|email',
            'website' => 'nullable|url',
            'logo_kecamatan' => 'nullable|file|mimes:png,jpg,jpeg|max:2048',
            'kop_surat' => 'nullable|file|mimes:png,jpg,jpeg|max:2048',
        ]);

        $user = auth()->user();

        if ($request->hasFile('logo_kecamatan')) {
            $validated['logo_kecamatan'] = $request->file('logo_kecamatan')->store('kecamatan/logo', 'public');
        }

        if ($request->hasFile('kop_surat')) {
            $validated['kop_surat'] = $request->file('kop_surat')->store('kecamatan/kop', 'public');
        }

        $validated['kode_kecamatan'] = $user->kode_kecamatan;

        DetailKecamatan::updateOrCreate(
            ['kode_kecamatan' => $user->kode_kecamatan],
            $validated
        );

        return redirect()->back()->with('success', 'Profil kecamatan berhasil diperbarui!');
    }
}
