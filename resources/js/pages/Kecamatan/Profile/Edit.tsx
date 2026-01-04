import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormEventHandler } from 'react';
import { Building2, Save, Upload, MapPin, Phone, Globe, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetailKecamatan {
    id: number;
    kode_kecamatan: string;
    alamat_kantor: string;
    no_telepon: string;
    email: string | null;
    website: string | null;
    logo_kecamatan: string | null;
    kop_surat: string | null;
}

interface Kecamatan {
    id: string;
    nama_kecamatan: string;
}

interface PageProps {
    detailKecamatan: DetailKecamatan | null;
    kecamatan: Kecamatan;
}

export default function Edit({ detailKecamatan, kecamatan }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        alamat_kantor: detailKecamatan?.alamat_kantor || '',
        no_telepon: detailKecamatan?.no_telepon || '',
        email: detailKecamatan?.email || '',
        website: detailKecamatan?.website || '',
        logo_kecamatan: null as File | null,
        kop_surat: null as File | null,
        _method: 'POST',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('kecamatan.profile.update'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Profil Kecamatan" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Profil Kecamatan {kecamatan.nama_kecamatan}
                        </h2>
                        <p className="text-muted-foreground">
                            Kelola informasi kantor kecamatan dan kelengkapan surat.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6">
                        <form onSubmit={submit} className="space-y-8">
                            {/* Informasi Kantor */}
                            <div>
                                <h3 className="mb-4 flex items-center text-sm font-bold uppercase tracking-wider text-emerald-600">
                                    <Building2 className="mr-2 h-4 w-4" />
                                    Informasi Kantor
                                </h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="md:col-span-2 space-y-2">
                                        <Label htmlFor="alamat_kantor">Alamat Kantor Lengkap</Label>
                                        <Textarea
                                            id="alamat_kantor"
                                            value={data.alamat_kantor}
                                            onChange={(e) => setData('alamat_kantor', e.target.value)}
                                            rows={3}
                                            placeholder="Jl. Raya..."
                                            required
                                        />
                                        {errors.alamat_kantor && <p className="text-xs text-red-600">{errors.alamat_kantor}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="no_telepon">Nomor Telepon Kantor</Label>
                                        <Input
                                            id="no_telepon"
                                            value={data.no_telepon}
                                            onChange={(e) => setData('no_telepon', e.target.value)}
                                            placeholder="02XX-XXXXXXX"
                                            required
                                        />
                                        {errors.no_telepon && <p className="text-xs text-red-600">{errors.no_telepon}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Kantor</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="kecamatan@cianjurkab.go.id"
                                        />
                                        {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            placeholder="https://..."
                                        />
                                        {errors.website && <p className="text-xs text-red-600">{errors.website}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Dokumen & Digital Signature */}
                            <div className="border-t pt-6">
                                <h3 className="mb-4 flex items-center text-sm font-bold uppercase tracking-wider text-blue-600">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Atribut Surat
                                </h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="logo_kecamatan">Logo Kecamatan (Opsional)</Label>
                                        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center hover:bg-slate-50">
                                            {detailKecamatan?.logo_kecamatan && (
                                                <div className="mb-4 flex justify-center">
                                                    <img 
                                                        src={`/storage/${detailKecamatan.logo_kecamatan}`} 
                                                        alt="Logo" 
                                                        className="h-24 w-24 object-contain"
                                                    />
                                                </div>
                                            )}
                                            <Input
                                                id="logo_kecamatan"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('logo_kecamatan', e.target.files?.[0] || null)}
                                                className="cursor-pointer"
                                            />
                                            <p className="mt-2 text-xs text-muted-foreground">Format: PNG, JPG (Transparan disarankan)</p>
                                        </div>
                                        {errors.logo_kecamatan && <p className="text-xs text-red-600">{errors.logo_kecamatan}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kop_surat">Kop Surat (Opsional)</Label>
                                        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center hover:bg-slate-50">
                                            {detailKecamatan?.kop_surat && (
                                                <div className="mb-4 flex justify-center">
                                                    <img 
                                                        src={`/storage/${detailKecamatan.kop_surat}`} 
                                                        alt="Kop Surat" 
                                                        className="h-24 w-auto object-contain"
                                                    />
                                                </div>
                                            )}
                                            <Input
                                                id="kop_surat"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('kop_surat', e.target.files?.[0] || null)}
                                                className="cursor-pointer"
                                            />
                                            <p className="mt-2 text-xs text-muted-foreground">Format: PNG, JPG (Lebar penuh)</p>
                                        </div>
                                        {errors.kop_surat && <p className="text-xs text-red-600">{errors.kop_surat}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <Button type="submit" disabled={processing} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
