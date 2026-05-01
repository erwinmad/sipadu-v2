<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // General
            ['key' => 'app_name', 'value' => 'SIPADU V2', 'type' => 'text', 'group' => 'general'],
            ['key' => 'app_title', 'value' => 'Portal Layanan Publik Digital', 'type' => 'text', 'group' => 'general'],
            ['key' => 'app_logo', 'value' => '/logo/sugih-mukti.png', 'type' => 'image', 'group' => 'general'],
            ['key' => 'app_hero', 'value' => '/images/hero.jpg', 'type' => 'image', 'group' => 'general'],
            ['key' => 'app_banner', 'value' => '/images/banner.jpg', 'type' => 'image', 'group' => 'general'],
            ['key' => 'app_description', 'value' => 'Pelayanan publik yang transparan, akuntabel, dan efisien untuk masyarakat Kabupaten Cianjur.', 'type' => 'textarea', 'group' => 'general'],
            
            // Contact
            ['key' => 'contact_email', 'value' => 'diskominfo@cianjurkab.go.id', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'contact_phone', 'value' => '0263-1234567', 'type' => 'text', 'group' => 'contact'],
            ['key' => 'contact_address', 'value' => 'Jl. Siti Jenab No. 31, Cianjur', 'type' => 'textarea', 'group' => 'contact'],
            
            // Social Media
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/cianjurkab', 'type' => 'text', 'group' => 'social'],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/cianjurkab', 'type' => 'text', 'group' => 'social'],
            ['key' => 'social_twitter', 'value' => 'https://twitter.com/cianjurkab', 'type' => 'text', 'group' => 'social'],
            ['key' => 'social_youtube', 'value' => 'https://youtube.com/cianjurkab', 'type' => 'text', 'group' => 'social'],
        ];

        foreach ($settings as $setting) {
            \App\Models\Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
