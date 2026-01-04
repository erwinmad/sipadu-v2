<?php

namespace App\Http\Controllers\Kecamatan;

use App\Http\Controllers\Controller;
use App\Models\DaftarPejabat;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PejabatController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $pejabat = DaftarPejabat::where('kode_kecamatan', $user->kode_kecamatan)
            ->latest()
            ->get();

        return Inertia::render('Kecamatan/Pejabat/Index', [
            'pejabat' => $pejabat,
        ]);
    }

    public function create()
    {
        return Inertia::render('Kecamatan/Pejabat/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_pejabat' => 'required|string',
            'nip' => 'required|string|size:18|unique:daftar_pejabat,nip',
            'jabatan' => 'required|string',
            'jenis_pejabat' => 'required|in:camat,sekretaris,kasi,lainnya',
            'mulai_jabatan' => 'nullable|date',
            'selesai_jabatan' => 'nullable|date',
            'ttd_digital' => 'nullable|file|mimes:png,jpg,jpeg|max:1024',
            'stempel' => 'nullable|file|mimes:png,jpg,jpeg|max:1024',
        ]);

        $user = auth()->user();
        $validated['kode_kecamatan'] = $user->kode_kecamatan;

        if ($request->hasFile('ttd_digital')) {
            $validated['ttd_digital'] = $request->file('ttd_digital')->store('pejabat/ttd', 'public');
        }

        if ($request->hasFile('stempel')) {
            $validated['stempel'] = $request->file('stempel')->store('pejabat/stempel', 'public');
        }

        DaftarPejabat::create($validated);

        return redirect()->route('kecamatan.pejabat.index')->with('success', 'Pejabat berhasil ditambahkan!');
    }

    public function edit(DaftarPejabat $pejabat)
    {
        // Ensure pejabat belongs to user's kecamatan
        if ($pejabat->kode_kecamatan !== auth()->user()->kode_kecamatan) {
            abort(403);
        }

        return Inertia::render('Kecamatan/Pejabat/Edit', [
            'pejabat' => $pejabat,
        ]);
    }

    public function update(Request $request, DaftarPejabat $pejabat)
    {
        // Ensure pejabat belongs to user's kecamatan
        if ($pejabat->kode_kecamatan !== auth()->user()->kode_kecamatan) {
            abort(403);
        }

        $validated = $request->validate([
            'nama_pejabat' => 'required|string',
            'nip' => 'required|string|size:18|unique:daftar_pejabat,nip,' . $pejabat->id,
            'jabatan' => 'required|string',
            'jenis_pejabat' => 'required|in:camat,sekretaris,kasi,lainnya',
            'is_active' => 'boolean',
            'mulai_jabatan' => 'nullable|date',
            'selesai_jabatan' => 'nullable|date',
            'ttd_digital' => 'nullable|file|mimes:png,jpg,jpeg|max:1024',
            'stempel' => 'nullable|file|mimes:png,jpg,jpeg|max:1024',
        ]);

        if ($request->hasFile('ttd_digital')) {
            $validated['ttd_digital'] = $request->file('ttd_digital')->store('pejabat/ttd', 'public');
        }

        if ($request->hasFile('stempel')) {
            $validated['stempel'] = $request->file('stempel')->store('pejabat/stempel', 'public');
        }

        $pejabat->update($validated);

        return redirect()->route('kecamatan.pejabat.index')->with('success', 'Pejabat berhasil diperbarui!');
    }

    public function destroy(DaftarPejabat $pejabat)
    {
        // Ensure pejabat belongs to user's kecamatan
        if ($pejabat->kode_kecamatan !== auth()->user()->kode_kecamatan) {
            abort(403);
        }

        $pejabat->delete();

        return redirect()->route('kecamatan.pejabat.index')->with('success', 'Pejabat berhasil dihapus!');
    }
}
