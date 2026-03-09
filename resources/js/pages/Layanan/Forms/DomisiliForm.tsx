import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from '@inertiajs/react';
import { Upload, X, Info, MapPin, Calendar, Hash, Home } from 'lucide-react';
import { FormEventHandler } from 'react';
import FileUpload from '@/components/file-upload';

interface Desa {
    id: string;
    kode_kecamatan: string;
    nama_desa: string;
}

interface Kecamatan {
    id: string;
    nama_kecamatan: string;
    desas: Desa[];
}

interface DomisiliFormProps {
    slug: string;
    kecamatans: Kecamatan[];
    onSuccess?: () => void;
}

export default function DomisiliForm({ slug, kecamatans, onSuccess }: DomisiliFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kode_kecamatan: '',
        kode_desa: '',
        no_pengantar: '',
        tgl_pengantar: '',
        alamat_domisili: '',
        ktp: null as File | null,
        kk: null as File | null,
        pengantar: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/layanan/${slug}`, {
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-8">
            {/* Info Box */}
            <div className="rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 p-4">
                <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                        <p className="font-semibold">Persyaratan Dokumen:</p>
                        <ul className="mt-1 list-inside list-disc space-y-1 text-blue-800 dark:text-blue-200">
                            <li>Scan KTP Asli (Format JPG/PDF, Maks 2MB)</li>
                            <li>Scan KK Asli (Format JPG/PDF, Maks 2MB)</li>
                            <li>Surat Pengantar RT/RW (Format JPG/PDF, Maks 2MB)</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Section: Wilayah */}
            <div>
                 <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500">
                    <MapPin className="mr-2 h-4 w-4" />
                    Data Wilayah
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div className="space-y-1">
                        <Label htmlFor="kode_kecamatan" className="text-xs text-slate-500 dark:text-slate-400">Kecamatan</Label>
                        <Select 
                            onValueChange={(value) => {
                                setData(data => ({ ...data, kode_kecamatan: value, kode_desa: '' }));
                            }} 
                            defaultValue={data.kode_kecamatan}
                        >
                            <SelectTrigger id="kode_kecamatan" className="h-9">
                                <SelectValue placeholder="Pilih Kecamatan" />
                            </SelectTrigger>
                            <SelectContent>
                                {kecamatans.map((kec) => (
                                    <SelectItem key={kec.id} value={kec.id}>
                                        {kec.nama_kecamatan}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         {errors.kode_kecamatan && <p className="text-xs text-red-600 dark:text-red-400">{errors.kode_kecamatan}</p>}
                    </div>
                   <div className="space-y-1">
                        <Label htmlFor="kode_desa" className="text-xs text-slate-500 dark:text-slate-400">Desa / Kelurahan</Label>
                        <Select 
                            onValueChange={(value) => setData('kode_desa', value)} 
                            defaultValue={data.kode_desa}
                            disabled={!data.kode_kecamatan}
                        >
                            <SelectTrigger id="kode_desa" className="h-9">
                                <SelectValue placeholder="Pilih Desa" />
                            </SelectTrigger>
                            <SelectContent>
                                {kecamatans.find(k => k.id === data.kode_kecamatan)?.desas.map((desa) => (
                                    <SelectItem key={desa.id} value={desa.id}>
                                        {desa.nama_desa}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.kode_desa && <p className="text-xs text-red-600">{errors.kode_desa}</p>}
                    </div>
                </div>
            </div>

            {/* Section: Pengantar */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                 <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500">
                    <Hash className="mr-2 h-4 w-4" />
                    Data Surat Pengantar
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div className="space-y-1">
                        <Label htmlFor="no_pengantar" className="text-xs text-slate-500 dark:text-slate-400">Nomor Pengantar RT/RW</Label>
                        <Input
                            id="no_pengantar"
                            value={data.no_pengantar}
                            onChange={(e) => setData('no_pengantar', e.target.value)}
                            placeholder="Contoh: 470/01/RT.01/2024"
                            required
                        />
                         {errors.no_pengantar && <p className="text-xs text-red-600 dark:text-red-400">{errors.no_pengantar}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="tgl_pengantar" className="text-xs text-slate-500 dark:text-slate-400">Tanggal Pengantar</Label>
                        <Input
                            id="tgl_pengantar"
                            type="date"
                            value={data.tgl_pengantar}
                            onChange={(e) => setData('tgl_pengantar', e.target.value)}
                            required
                        />
                         {errors.tgl_pengantar && <p className="text-xs text-red-600 dark:text-red-400">{errors.tgl_pengantar}</p>}
                    </div>
                     <div className="space-y-1 md:col-span-2">
                        <Label htmlFor="alamat_domisili" className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                            <Home className="mr-1 h-3 w-3 inline" />
                            Alamat Domisili
                        </Label>
                        <Textarea
                            id="alamat_domisili"
                            value={data.alamat_domisili}
                            onChange={(e) => setData('alamat_domisili', e.target.value)}
                            rows={2}
                            placeholder="Masukkan alamat lengkap sesuai domisili saat ini..."
                            required
                        />
                         {errors.alamat_domisili && <p className="text-xs text-red-600 dark:text-red-400">{errors.alamat_domisili}</p>}
                    </div>
                </div>
            </div>

            {/* Section: Dokumen */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500">
                    <Upload className="mr-2 h-4 w-4" />
                    Dokumen Persyaratan
                </h3>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                     <FileUpload
                        label="Scan KTP"
                        id="ktp"
                        file={data.ktp}
                        onChange={(f) => setData('ktp', f)}
                        error={errors.ktp}
                        required
                    />
                     <FileUpload
                        label="Scan Kartu Keluarga"
                        id="kk"
                        file={data.kk}
                        onChange={(f) => setData('kk', f)}
                        error={errors.kk}
                        required
                    />
                     <FileUpload
                        label="Surat Pengantar RT/RW"
                        id="pengantar"
                        file={data.pengantar}
                        onChange={(f) => setData('pengantar', f)}
                        error={errors.pengantar}
                        required
                    />
                </div>
            </div>

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-xl bg-emerald-600 dark:bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 dark:shadow-none transition-all hover:bg-emerald-700 dark:hover:bg-emerald-500 hover:-translate-y-0.5 disabled:opacity-50"
                >
                    {processing ? 'MENGIRIM...' : 'KIRIM PERMOHONAN DOMISILI'}
                </button>
            </div>
        </form>
    );
}
