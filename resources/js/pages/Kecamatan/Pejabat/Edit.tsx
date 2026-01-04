import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEventHandler } from 'react';
import { UserCheck, Save, ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface Pejabat {
    id: number;
    nama_pejabat: string;
    nip: string;
    jabatan: string;
    jenis_pejabat: string;
    is_active: boolean;
    mulai_jabatan: string;
    selesai_jabatan: string;
    ttd_digital_url?: string;
    stempel_url?: string;
    ttd_digital?: string; // raw path
    stempel?: string; // raw path
}

interface Props {
    pejabat: Pejabat;
}

export default function Edit({ pejabat }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        nama_pejabat: pejabat.nama_pejabat || '',
        nip: pejabat.nip || '',
        jabatan: pejabat.jabatan || '',
        jenis_pejabat: pejabat.jenis_pejabat || '',
        is_active: Boolean(pejabat.is_active),
        mulai_jabatan: pejabat.mulai_jabatan || '',
        selesai_jabatan: pejabat.selesai_jabatan || '',
        ttd_digital: null as File | null,
        stempel: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('kecamatan.pejabat.update', pejabat.id), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Pejabat" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={route('kecamatan.pejabat.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Edit Data Pejabat
                        </h2>
                        <p className="text-muted-foreground">
                            Perbarui informasi pejabat dan tanda tangan digital.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6">
                        <form onSubmit={submit} className="space-y-8">
                            <div>
                                <h3 className="mb-4 flex items-center text-sm font-bold uppercase tracking-wider text-emerald-600">
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Data Pribadi & Jabatan
                                </h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_pejabat">Nama Lengkap (dengan gelar)</Label>
                                        <Input
                                            id="nama_pejabat"
                                            value={data.nama_pejabat}
                                            onChange={(e) => setData('nama_pejabat', e.target.value)}
                                            placeholder="Contoh: Drs. H. Budi Santoso, M.Si"
                                            required
                                        />
                                        {errors.nama_pejabat && <p className="text-xs text-red-600">{errors.nama_pejabat}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nip">NIP</Label>
                                        <Input
                                            id="nip"
                                            value={data.nip}
                                            onChange={(e) => setData('nip', e.target.value)}
                                            minLength={18}
                                            maxLength={18}
                                            placeholder="19xxxxxxxxxxxxxxxx"
                                            required
                                        />
                                        {errors.nip && <p className="text-xs text-red-600">{errors.nip}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="jabatan">Nama Jabatan</Label>
                                        <Input
                                            id="jabatan"
                                            value={data.jabatan}
                                            onChange={(e) => setData('jabatan', e.target.value)}
                                            placeholder="Contoh: Camat Cianjur"
                                            required
                                        />
                                        {errors.jabatan && <p className="text-xs text-red-600">{errors.jabatan}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="jenis_pejabat">Jenis Pejabat</Label>
                                        <Select value={data.jenis_pejabat} onValueChange={(value) => setData('jenis_pejabat', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Jenis" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="camat">Camat</SelectItem>
                                                <SelectItem value="sekretaris">Sekretaris Camat</SelectItem>
                                                <SelectItem value="kasi">Kasi / Kepala Seksi</SelectItem>
                                                <SelectItem value="lainnya">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.jenis_pejabat && <p className="text-xs text-red-600">{errors.jenis_pejabat}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mulai_jabatan">Mulai Menjabat</Label>
                                        <Input
                                            id="mulai_jabatan"
                                            type="date"
                                            value={data.mulai_jabatan}
                                            onChange={(e) => setData('mulai_jabatan', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="selesai_jabatan">Akhir Menjabat</Label>
                                        <Input
                                            id="selesai_jabatan"
                                            type="date"
                                            value={data.selesai_jabatan}
                                            onChange={(e) => setData('selesai_jabatan', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2 pt-8">
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                        <Label htmlFor="is_active">Status Aktif (Dapat menandatangani dokumen)</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="mb-4 flex items-center text-sm font-bold uppercase tracking-wider text-blue-600">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Tanda Tangan Digital & Stempel
                                </h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Tanda Tangan */}
                                    <div className="space-y-3">
                                        <Label htmlFor="ttd_digital">Scan Tanda Tangan</Label>
                                        
                                        {pejabat.ttd_digital && (
                                            <div className="mb-3 rounded-lg border bg-slate-50 p-3">
                                                <p className="mb-2 text-xs font-semibold text-slate-500">File Saat Ini:</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded bg-white p-1 border">
                                                        <img 
                                                            src={`/storage/${pejabat.ttd_digital}`} 
                                                            alt="TTD Preview" 
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-600 truncate max-w-[200px]">{pejabat.ttd_digital.split('/').pop()}</span>
                                                    <div className="ml-auto text-emerald-600">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center hover:bg-slate-50 transition-colors">
                                            <Input
                                                id="ttd_digital"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('ttd_digital', e.target.files?.[0] || null)}
                                                className="cursor-pointer"
                                            />
                                            <p className="mt-2 text-xs text-muted-foreground">Format: PNG Transparan (Maks. 1MB)</p>
                                        </div>
                                        {errors.ttd_digital && <p className="text-xs text-red-600">{errors.ttd_digital}</p>}
                                    </div>

                                    {/* Stempel */}
                                    <div className="space-y-3">
                                        <Label htmlFor="stempel">Scan Stempel</Label>
                                        
                                        {pejabat.stempel && (
                                            <div className="mb-3 rounded-lg border bg-slate-50 p-3">
                                                <p className="mb-2 text-xs font-semibold text-slate-500">File Saat Ini:</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded bg-white p-1 border">
                                                        <img 
                                                            src={`/storage/${pejabat.stempel}`} 
                                                            alt="Stempel Preview" 
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-600 truncate max-w-[200px]">{pejabat.stempel.split('/').pop()}</span>
                                                    <div className="ml-auto text-emerald-600">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center hover:bg-slate-50 transition-colors">
                                            <Input
                                                id="stempel"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('stempel', e.target.files?.[0] || null)}
                                                className="cursor-pointer"
                                            />
                                            <p className="mt-2 text-xs text-muted-foreground">Format: PNG Transparan (Maks. 1MB)</p>
                                        </div>
                                        {errors.stempel && <p className="text-xs text-red-600">{errors.stempel}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Perbarui Pejabat'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
