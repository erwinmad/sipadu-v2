<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Layanan;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class LayananController extends Controller
{
    public function index(Request $request)
    {
        $query = Layanan::query();

        if ($request->filled('search')) {
            $query->where('nama_layanan', 'ilike', '%' . $request->search . '%')
                  ->orWhere('deskripsi', 'ilike', '%' . $request->search . '%');
        }

        $layanans = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Layanan/Index', [
            'layanans' => $layanans,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_layanan' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:layanans',
            'deskripsi' => 'nullable|string',
            'is_active' => 'boolean',
            'informasi_status' => 'nullable|string',
        ]);

        Layanan::create($validated);

        return redirect()->back()->with('success', 'Layanan berhasil dibuat.');
    }

    public function update(Request $request, Layanan $layanan)
    {
        $validated = $request->validate([
            'nama_layanan' => 'required|string|max:255',
            'slug' => ['required', 'string', 'max:255', Rule::unique('layanans')->ignore($layanan->id)],
            'deskripsi' => 'nullable|string',
            'is_active' => 'boolean',
            'informasi_status' => 'nullable|string',
        ]);

        $layanan->update($validated);

        return redirect()->back()->with('success', 'Layanan berhasil diperbarui.');
    }

    public function destroy(Layanan $layanan)
    {
        $layanan->delete();
        return redirect()->back()->with('success', 'Layanan berhasil dihapus.');
    }
}
