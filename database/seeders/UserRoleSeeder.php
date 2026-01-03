<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Roles
        $roleSuperAdmin = \Spatie\Permission\Models\Role::firstOrCreate(['name' => \App\Enums\EnumRoles::SUPERADMIN->value]);
        $roleKecamatan = \Spatie\Permission\Models\Role::firstOrCreate(['name' => \App\Enums\EnumRoles::KECAMATAN->value]);
        $roleUser = \Spatie\Permission\Models\Role::firstOrCreate(['name' => \App\Enums\EnumRoles::USER->value]);

        // Create Users
        $superAdmin = \App\Models\User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@cianjurkab.go.id',
            'password' => bcrypt('123'),
        ]);
        $superAdmin->assignRole($roleSuperAdmin);

        $kecamatan = \App\Models\User::factory()->create([
            'name' => 'Kecamatan User',
            'email' => 'kecamatan@cianjurkab.go.id',
            'password' => bcrypt('123'),
            'kode_kecamatan' => '32.05.010', // Contoh kode kecamatan Agrabinta
        ]);
        $kecamatan->assignRole($roleKecamatan);

        $user = \App\Models\User::factory()->create([
            'name' => 'Regular User',
            'email' => 'user@cianjurkab.go.id',
            'password' => bcrypt('123'),
        ]);
        $user->assignRole($roleUser);
    }
}
