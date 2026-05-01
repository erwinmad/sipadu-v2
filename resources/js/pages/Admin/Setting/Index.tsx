import { Head, useForm, usePage } from '@inertiajs/react';
import { Save, Globe, Share2, Phone, Sparkles, Image as ImageIcon, Upload, X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from '@/components/file-upload';

interface Setting {
    id: number;
    key: string;
    value: string;
    type: string;
    group: string;
}

interface PageProps {
    settings: Record<string, Setting[]>;
}

export default function Index({ settings }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Pengaturan', href: '/admin/pengaturan' },
    ];

    const { data, setData, post, processing } = useForm<{
        settings: { key: string; value: string | File | null }[];
    }>({
        settings: Object.values(settings).flat().map(s => ({
            key: s.key,
            value: s.value
        }))
    });

    const handleChange = (key: string, value: string | File | null) => {
        const newSettings = data.settings.map(s => 
            s.key === key ? { ...s, value } : s
        );
        setData('settings', newSettings);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Use forceFormData for file uploads
        post('/admin/pengaturan', {
            forceFormData: true,
            onSuccess: () => alert('Pengaturan berhasil diperbarui'),
        });
    };

    const getGroupSettings = (group: string) => {
        return settings[group] || [];
    };

    const renderField = (setting: Setting) => {
        const currentValue = data.settings.find(s => s.key === setting.key)?.value;

        switch (setting.type) {
            case 'textarea':
                return (
                    <Textarea 
                        id={setting.key}
                        value={typeof currentValue === 'string' ? currentValue : ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="min-h-[100px]"
                    />
                );
            case 'image':
                return (
                    <div className="space-y-4">
                        {setting.value && typeof setting.value === 'string' && ! (currentValue instanceof File) && (
                            <div className="relative w-full max-w-[200px] overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                                <img src={setting.value} alt={setting.key} className="h-auto w-full object-cover" />
                                <div className="absolute top-1 right-1">
                                    <div className="bg-emerald-500 text-white p-1 rounded-full">
                                        <ImageIcon className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <FileUpload 
                            id={setting.key}
                            label={`Upload ${setting.key.replace(/_/g, ' ')} baru`}
                            file={currentValue instanceof File ? currentValue : null}
                            onChange={(file) => handleChange(setting.key, file)}
                            accept="image/*"
                        />
                    </div>
                );
            default:
                return (
                    <Input 
                        id={setting.key}
                        value={typeof currentValue === 'string' ? currentValue : ''}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        type="text"
                    />
                );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Aplikasi" />
            
            <div className="p-4 lg:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Pengaturan Sistem</h1>
                        <p className="text-sm text-slate-500">Konfigurasi identitas, kontak, dan tampilan visual aplikasi secara global.</p>
                    </div>
                    <Button onClick={submit} disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20">
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* General Settings */}
                    <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                <Globe className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Branding & Identitas</span>
                            </div>
                            <CardTitle className="text-lg">Informasi Umum</CardTitle>
                            <CardDescription className="text-xs">Nama aplikasi, judul, dan deskripsi utama yang muncul di publik.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {getGroupSettings('general').map(setting => (
                                <div key={setting.key} className="space-y-2">
                                    <Label htmlFor={setting.key} className="text-xs font-bold uppercase tracking-tight text-slate-500">
                                        {setting.key.replace(/_/g, ' ')}
                                    </Label>
                                    {renderField(setting)}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {/* Contact Settings */}
                        <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <div className="flex items-center gap-2 text-blue-600 mb-1">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Kontak Resmi</span>
                                </div>
                                <CardTitle className="text-lg">Saluran Komunikasi</CardTitle>
                                <CardDescription className="text-xs">Email, nomor telepon, dan alamat fisik kantor dinas.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {getGroupSettings('contact').map(setting => (
                                    <div key={setting.key} className="space-y-2">
                                        <Label htmlFor={setting.key} className="text-xs font-bold uppercase tracking-tight text-slate-500">
                                            {setting.key.replace(/_/g, ' ')}
                                        </Label>
                                        {renderField(setting)}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Social Media */}
                        <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <div className="flex items-center gap-2 text-purple-600 mb-1">
                                    <Share2 className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Kehadiran Digital</span>
                                </div>
                                <CardTitle className="text-lg">Media Sosial</CardTitle>
                                <CardDescription className="text-xs">Tautan resmi ke akun media sosial pemerintah daerah.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {getGroupSettings('social').map(setting => (
                                    <div key={setting.key} className="space-y-2">
                                        <Label htmlFor={setting.key} className="text-xs font-bold uppercase tracking-tight text-slate-500">
                                            {setting.key.replace(/_/g, ' ')}
                                        </Label>
                                        {renderField(setting)}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
