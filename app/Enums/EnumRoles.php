<?php

namespace App\Enums;

enum EnumRoles: string
{
    case SUPERADMIN = 'superadmin';
    case KECAMATAN = 'kecamatan';
    case USER = 'users';

    public function label(): string
    {
        return match ($this) {
            self::SUPERADMIN => 'Super Admin',
            self::KECAMATAN => 'Kecamatan',
            self::USER => 'Pengguna',
        };
    }
}
