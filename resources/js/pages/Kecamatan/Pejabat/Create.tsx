import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormEventHandler } from 'react';
import { UserCheck, Save, ArrowLeft, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_pejabat: '',
        nip: '',
        jabatan: '',
        jenis_pejabat: '',
        mulai_jabatan: '',
        selesai_jabatan: '',
        ttd_digital: null as File | null,
        stempel: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('kecamatan.pejabat.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Tambah Pejabat" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href={route('kecamatan.pejabat.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Tambah Pejabat Baru
                        </h2>
                        <p className="text-muted-foreground">
                            Input data pejabat untuk penandatanganan dokumen.
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
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="mb-4 flex items-center text-sm font-bold uppercase tracking-wider text-blue-600">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Tanda Tangan Digital
                                </h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="ttd_digital">Scan Tanda Tangan (PNG Transparan)</Label>
                                        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center hover:bg-slate-50">
                                            <Input
                                                id="ttd_digital"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('ttd_digital', e.target.files?.[0] || null)}
                                                className="cursor-pointer"
                                            />
                                            <p className="mt-2 text-xs text-muted-foreground">Format: PNG (Background transparan wajib)</p>
                                        </div>
                                        {errors.ttd_digital && <p className="text-xs text-red-600">{errors.ttd_digital}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stempel">Scan Stempel (PNG Transparan)</Label>
                                        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center hover:bg-slate-50">
                                            <Input
                                                id="stempel"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('stempel', e.target.files?.[0] || null)}
                                                className="cursor-pointer"
                                            />
                                            <p className="mt-2 text-xs text-muted-foreground">Format: PNG (Background transparan wajib)</p>
                                        </div>
                                        {errors.stempel && <p className="text-xs text-red-600">{errors.stempel}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan Pejabat'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
