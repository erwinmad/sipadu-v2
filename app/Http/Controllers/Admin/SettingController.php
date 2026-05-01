<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->groupBy('group');
        
        return Inertia::render('Admin/Setting/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        // For debugging multipart/form-data with Inertia
        // logger($request->all());

        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($data['settings'] as $index => $item) {
            $setting = Setting::where('key', $item['key'])->first();
            
            if (!$setting) continue;

            $value = $item['value'];

            // Handle file upload if the value is a file
            if ($request->hasFile("settings.{$index}.value")) {
                $file = $request->file("settings.{$index}.value");
                $path = $file->store('settings', 'public');
                $value = '/storage/' . $path;
                
                // Optional: Delete old file if it exists and is in storage
                if ($setting->value && str_contains($setting->value, '/storage/settings/')) {
                    $oldPath = str_replace('/storage/', '', $setting->value);
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
                }
            }

            $setting->update(['value' => $value]);
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
