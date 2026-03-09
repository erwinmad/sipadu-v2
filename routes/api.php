<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PermohonanApiController;
use App\Http\Controllers\Api\VerifikasiUserApiController;
use App\Http\Controllers\Api\DashboardApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Dashboard API - semua data kecamatan dalam 1 call
Route::middleware('auth:sanctum')->get('/dashboard', [DashboardApiController::class, 'index']);

// Permohonan API Routes - Protected by Sanctum
Route::middleware('auth:sanctum')->prefix('permohonan')->group(function () {
    // Daftar kecamatan (untuk dropdown di SIMWEB)
    Route::get('/kecamatan', [PermohonanApiController::class, 'kecamatanList']);

    // Statistik permohonan (global atau per kecamatan)
    Route::get('/statistics', [PermohonanApiController::class, 'statistics']);

    // Semua permohonan per kecamatan (wajib kirim kode_kecamatan)
    Route::get('/', [PermohonanApiController::class, 'index']);

    // Detail permohonan
    Route::get('/{jenis}/{token}', [PermohonanApiController::class, 'show']);

    // Update permohonan (status, tanggapan, file hasil)
    Route::put('/{jenis}/{token}', [PermohonanApiController::class, 'update']);
    Route::patch('/{jenis}/{token}', [PermohonanApiController::class, 'update']);
});

// Verifikasi User API Routes - Protected by Sanctum
Route::middleware('auth:sanctum')->prefix('verifikasi-user')->group(function () {
    // Daftar pengguna yang perlu diverifikasi
    Route::get('/', [VerifikasiUserApiController::class, 'index']);

    // Detail pengguna
    Route::get('/{userId}', [VerifikasiUserApiController::class, 'show']);

    // Verifikasi atau tolak pengguna
    Route::put('/{userId}', [VerifikasiUserApiController::class, 'verify']);
});
