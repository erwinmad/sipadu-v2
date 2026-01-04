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

        return $next($request);
    }
}
