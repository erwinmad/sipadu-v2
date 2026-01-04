<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [\App\Http\Controllers\LandingController::class, 'index'])->name('home');

// Public layanan routes
Route::get('/layanan/{slug}', [\App\Http\Controllers\LayananPublicController::class, 'show'])->name('layanan.show')->middleware(['auth', 'profile.complete']);
Route::post('/layanan/{slug}', [\App\Http\Controllers\LayananPublicController::class, 'store'])->name('layanan.store')->middleware(['auth', 'profile.complete']);

// Tracking routes
Route::get('/tracking', [\App\Http\Controllers\TrackingController::class, 'index'])->name('tracking.index');
Route::post('/tracking', [\App\Http\Controllers\TrackingController::class, 'show'])->name('tracking.show');

// Google OAuth routes
Route::get('/auth/google', [\App\Http\Controllers\Auth\SocialiteController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [\App\Http\Controllers\Auth\SocialiteController::class, 'handleGoogleCallback']);

Route::middleware(['auth', 'verified'])->group(function () {
    // Profile completion routes
    Route::get('/profile/complete', [\App\Http\Controllers\ProfileController::class, 'show'])->name('profile.complete');
    Route::post('/profile/complete', [\App\Http\Controllers\ProfileController::class, 'store'])->name('profile.store');
    
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->hasRole('superadmin')) {
            return redirect()->route('admin.dashboard');
        }
        if ($user->hasRole('kecamatan')) {
            return redirect()->route('kecamatan.dashboard');
        }
        return redirect()->route('user.dashboard');
    })->name('dashboard');

    Route::middleware(['role:superadmin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::resource('pengguna', \App\Http\Controllers\Admin\PenggunaController::class);
        Route::resource('layanan', \App\Http\Controllers\Admin\LayananController::class);
    });

    Route::middleware(['role:kecamatan'])->prefix('kecamatan')->name('kecamatan.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Kecamatan\DashboardController::class, 'index'])->name('dashboard');
        
        // Permohonan Management
        Route::get('/permohonan', [\App\Http\Controllers\Kecamatan\PermohonanController::class, 'index'])->name('permohonan.index');
        Route::get('/permohonan/{jenis}/{token}', [\App\Http\Controllers\Kecamatan\PermohonanController::class, 'show'])->name('permohonan.show');
        Route::post('/permohonan/{jenis}/{token}', [\App\Http\Controllers\Kecamatan\PermohonanController::class, 'update'])->name('permohonan.update');
        
        // Profile Kecamatan
        Route::get('/profile', [\App\Http\Controllers\Kecamatan\ProfileKecamatanController::class, 'edit'])->name('profile.edit');
        Route::post('/profile', [\App\Http\Controllers\Kecamatan\ProfileKecamatanController::class, 'update'])->name('profile.update');
        
        // Pejabat Management
        Route::resource('pejabat', \App\Http\Controllers\Kecamatan\PejabatController::class);
    });

    Route::middleware(['role:users'])->prefix('users')->name('user.')->group(function () {
        Route::get('/', [\App\Http\Controllers\User\DashboardController::class, 'index'])->name('dashboard');
    });
});

require __DIR__.'/settings.php';
