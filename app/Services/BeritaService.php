<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class BeritaService
{
    protected $baseUrl;
    protected $token;
    protected $endpoint;
    protected $cacheTime;

    public function __construct()
    {
        $this->baseUrl = env('VITE_STRAPI_URL', 'https://editor.cianjurkab.go.id');
        $this->token = env('VITE_STRAPI_TOKEN');
        $this->endpoint = env('VITE_POST_PATH', '/api/posts?populate=thumbnail&populate=categories&populate=Gambar&sort[0]=id:desc&sort[1]=tgl_tayang:desc&pagination[limit]=20');
        $this->cacheTime = env('VITE_STRAPI_CACHE_TIME', 3600);
    }

    public function fetchBerita()
    {
        return Cache::remember('berita-cianjur', $this->cacheTime, function () {
            if (!$this->token) {
                return ['data' => [], 'error' => 'API Token tidak dikonfigurasi'];
            }

            try {
                $response = Http::withToken($this->token)
                    ->withOptions(['verify' => false]) // Untuk bypass local SSL issue
                    ->get($this->baseUrl . $this->endpoint);
                    
                if ($response->successful()) {
                    return $response->json();
                }
                
                return ['data' => [], 'error' => 'Gagal mendapatkan data API (Status: ' . $response->status() . ')'];
            } catch (\Exception $e) {
                return ['data' => [], 'error' => 'Koneksi ke server berita gagal: ' . $e->getMessage()];
            }
        });
    }
}
