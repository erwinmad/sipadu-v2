<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Kecamatan;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;

class PenggunaController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles', 'kecamatan')->latest();

        if ($request->filled('search')) {
            $query->where('name', 'ilike', '%' . $request->search . '%')
                  ->orWhere('email', 'ilike', '%' . $request->search . '%');
        }

        if ($request->filled('role')) {
            $query->role($request->role);
        }

        $users = $query->paginate(10)->withQueryString();
        
        $roles = Role::all()->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'label' => \App\Enums\EnumRoles::tryFrom($role->name)?->label() ?? ucfirst($role->name),
            ];
        });
        $kecamatans = Kecamatan::all();

        return Inertia::render('Admin/Pengguna/Index', [
            'users' => $users,
            'roles' => $roles,
            'kecamatans' => $kecamatans,
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Store User Request:', $request->all());

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|exists:roles,name',
            'kode_kecamatan' => 'nullable|required_if:role,kecamatan|exists:kecamatans,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'kode_kecamatan' => $request->role === 'kecamatan' ? $request->kode_kecamatan : null,
        ]);

        $user->assignRole($request->role);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $pengguna)
    {
        \Illuminate\Support\Facades\Log::info('Update User Request:', $request->all());

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', \Illuminate\Validation\Rule::unique('users')->ignore($pengguna->id)],
            'role' => 'required|exists:roles,name',
            'kode_kecamatan' => 'nullable|required_if:role,kecamatan|exists:kecamatans,id',
        ]);

        $pengguna->update([
            'name' => $request->name,
            'email' => $request->email,
            'kode_kecamatan' => $request->role === 'kecamatan' ? $request->kode_kecamatan : null,
        ]);
        
        if ($request->filled('password')) {
             $request->validate([
                'password' => ['confirmed', \Illuminate\Validation\Rules\Password::defaults()],
            ]);
            $pengguna->update([
                'password' => Hash::make($request->password),
            ]);
        }

        $pengguna->syncRoles([$request->role]);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $pengguna)
    {
        $pengguna->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }
}
