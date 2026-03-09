<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileComplete
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect('login');
        }

        $user = auth()->user();

        // Admin and Kecamatan don't need profile completion
        if ($user->hasRole(['superadmin', 'kecamatan'])) {
            return $next($request);
        }

        // All other users must complete profile
        if (!$user->hasCompleteProfile()) {
            return redirect()->route('profile.complete')
                ->with('warning', 'Silakan lengkapi profil Anda terlebih dahulu sebelum mengajukan layanan.');
        }

        // Check if profile is verified by admin kecamatan
        $detailUser = $user->detailUser;
        if ($detailUser && !$detailUser->isVerified()) {
            $message = $detailUser->isRejected()
                ? 'Profil Anda ditolak oleh admin kecamatan. Silakan perbaiki data dan upload ulang dokumen Anda.'
                : 'Profil Anda sedang menunggu verifikasi oleh admin kecamatan. Anda akan diberitahu setelah profil diverifikasi.';

            return redirect()->route('profile.complete')
                ->with('verification_status', $detailUser->verification_status)
                ->with('verification_note', $detailUser->verification_note)
                ->with('warning', $message);
        }

        return $next($request);
    }
}
