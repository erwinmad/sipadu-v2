<?php

namespace App\Http\Controllers;

use App\Models\Layanan;
use App\Models\Domisili;
use App\Models\Sktm;
use App\Models\Nikah;
use App\Models\Usaha;
use App\Models\User;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        $layanans = Layanan::where('is_active', true)->get();

        // Calculate statistics
        $stats = [
            'total_permohonan' => Domisili::count() + Sktm::count() + Nikah::count() + Usaha::count(),
            'permohonan_selesai' => Domisili::where('status', 'selesai')->count() + 
                                    Sktm::where('status', 'selesai')->count() + 
                                    Nikah::where('status', 'selesai')->count() + 
                                    Usaha::where('status', 'selesai')->count(),
            'permohonan_proses' => Domisili::where('status', 'proses')->count() + 
                                   Sktm::where('status', 'proses')->count() + 
                                   Nikah::where('status', 'proses')->count() + 
                                   Usaha::where('status', 'proses')->count(),
            'total_pengguna' => User::count(),
        ];

        return Inertia::render('Landing/Index', [
            'layanans' => $layanans,
            'stats' => $stats,
        ]);
    }
}
