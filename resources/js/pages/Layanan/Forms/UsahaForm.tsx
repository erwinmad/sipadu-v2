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
import { Upload, X, Info, Store, Target, Hash, MapPin, User } from 'lucide-react';
import { FormEventHandler } from 'react';
import { store } from '@/actions/App/Http/Controllers/LayananPublicController';

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

interface UsahaFormProps {
    slug: string;
    kecamatans: Kecamatan[];
    onSuccess?: () => void;
}

export default function UsahaForm({ slug, kecamatans, onSuccess }: UsahaFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kode_kecamatan: '',
        kode_desa: '',
        no_pengantar: '',
        tgl_pengantar: '',
        
        jenis_usaha: '',
        kegiatan_usaha: '',
        nama_perusahaan: '',
        pemilik_usaha: '',
        alamat_usaha: '',
        
        ktp: null as File | null,
        sku: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(store.url(slug), {
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-8">
             {/* Info Box */}
             <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                    <Store className="mt-0.5 h-5 w-5 text-amber-600" />
                    <div className="text-sm text-amber-900">
                        <p className="font-semibold">Informasi Izin Usaha Mikro:</p>
                        <ul className="mt-1 list-inside list-disc space-y-1 text-amber-800">
                            <li>Layanan ini diperuntukkan bagi pelaku Usaha Mikro (Modal &lt; 50 Juta diluar tanah & bangunan).</li>
                            <li>Pastikan alamat usaha jelas dan sesuai dengan lokasi di lapangan.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Section: Wilayah */}
            <div>
                 <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    Data Wilayah Usaha
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div className="space-y-1">
                        <Label htmlFor="kode_kecamatan" className="text-xs text-gray-500">Kecamatan</Label>
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
                         {errors.kode_kecamatan && <p className="text-xs text-red-600">{errors.kode_kecamatan}</p>}
                    </div>
                   <div className="space-y-1">
                        <Label htmlFor="kode_desa" className="text-xs text-gray-500">Desa / Kelurahan</Label>
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
            <div className="border-t border-gray-100 pt-6">
                 <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <Hash className="mr-2 h-4 w-4" />
                    Data Surat Pengantar
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div className="space-y-1">
                        <Label htmlFor="no_pengantar" className="text-xs text-gray-500">Nomor Pengantar</Label>
                        <Input
                            id="no_pengantar"
                            value={data.no_pengantar}
                            onChange={(e) => setData('no_pengantar', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                         {errors.no_pengantar && <p className="text-xs text-red-600">{errors.no_pengantar}</p>}
                    </div>
                   <div className="space-y-1">
                        <Label htmlFor="tgl_pengantar" className="text-xs text-gray-500">Tanggal Pengantar</Label>
                        <Input
                            id="tgl_pengantar"
                            type="date"
                            value={data.tgl_pengantar}
                            onChange={(e) => setData('tgl_pengantar', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Section: Data Usaha */}
            <div className="border-t border-gray-100 pt-6">
                <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <Target className="mr-2 h-4 w-4" />
                    Detail Usaha
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div className="space-y-1">
                        <Label htmlFor="nama_perusahaan" className="text-xs text-gray-500">Nama Perusahaan / Toko</Label>
                        <Input
                            id="nama_perusahaan"
                            value={data.nama_perusahaan}
                            onChange={(e) => setData('nama_perusahaan', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="pemilik_usaha" className="text-xs text-gray-500">Nama Pemilik</Label>
                        <Input
                            id="pemilik_usaha"
                            value={data.pemilik_usaha}
                            onChange={(e) => setData('pemilik_usaha', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="jenis_usaha" className="text-xs text-gray-500">Jenis Usaha</Label>
                         <Input
                            id="jenis_usaha"
                            value={data.jenis_usaha}
                            onChange={(e) => setData('jenis_usaha', e.target.value)}
                             placeholder="Misal: Perdagangan, Jasa, Kuliner"
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="kegiatan_usaha" className="text-xs text-gray-500">Kegiatan Usaha</Label>
                         <Input
                            id="kegiatan_usaha"
                            value={data.kegiatan_usaha}
                            onChange={(e) => setData('kegiatan_usaha', e.target.value)}
                             placeholder="Misal: Jual Beli Sembako"
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                        <Label htmlFor="alamat_usaha" className="text-xs text-gray-500">Alamat Lengkap Usaha</Label>
                        <Textarea
                            id="alamat_usaha"
                            value={data.alamat_usaha}
                            onChange={(e) => setData('alamat_usaha', e.target.value)}
                            className="border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            rows={2}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Section: Dokumen */}
            <div className="border-t border-gray-100 pt-6">
                <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <Upload className="mr-2 h-4 w-4" />
                    Dokumen Persyaratan
                </h3>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <FileUpload
                        label="Scan KTP Pemilik"
                        id="ktp"
                        file={data.ktp}
                        onChange={(f) => setData('ktp', f)}
                        error={errors.ktp}
                        required
                    />
                     <FileUpload
                        label="Surat Keterangan Desa (SKU) - Jika ada"
                        id="sku"
                        file={data.sku}
                        onChange={(f) => setData('sku', f)}
                        error={errors.sku}
                    />
                </div>
            </div>

            <div className="pt-6">
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded-md bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {processing ? 'MENGIRIM...' : 'KIRIM PERMOHONAN'}
                </button>
            </div>
        </form>
    );
}

function FileUpload({ label, id, file, onChange, error, required }: { label: string, id: string, file: File | null, onChange: (f: File | null) => void, error?: string, required?: boolean }) {
    return (
        <div className="space-y-1">
            <Label htmlFor={id} className="text-xs font-medium text-gray-600">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {!file ? (
                <div className="relative">
                    <input
                        id={id}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => onChange(e.target.files?.[0] || null)}
                        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        required={required}
                    />
                    <div className="flex flex-col items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-4 text-center transition-colors peer-hover:border-emerald-500 peer-hover:bg-emerald-50 peer-focus:border-emerald-500 peer-focus:ring-1 peer-focus:ring-emerald-500">
                        <Upload className="mb-2 h-4 w-4 text-gray-400" />
                        <span className="text-[10px] text-gray-500">PDF/JPG (Max 2MB)</span>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <span className="max-w-[120px] truncate text-xs font-medium text-emerald-700">{file.name}</span>
                    <button type="button" onClick={() => onChange(null)} className="text-emerald-500 hover:text-emerald-700">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
             {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
