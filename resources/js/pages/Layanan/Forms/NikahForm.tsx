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
import { Upload, X, Info, Heart, User, Calendar, MapPin, Hash } from 'lucide-react';
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

interface NikahFormProps {
    slug: string;
    kecamatans: Kecamatan[];
    onSuccess?: () => void;
}

export default function NikahForm({ slug, kecamatans, onSuccess }: NikahFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kode_kecamatan: '',
        kode_desa: '',
        no_pengantar: '',
        tgl_pengantar: '',
        
        // Mempelai 1 (Pria/User)
        calon_mempelai1: '',
        bin_mempelai1: '',
        status_mempelai1: '',
        
        // Mempelai 2 (Pasangan)
        nama_mempelai2: '',
        calon_mempelai2: '', // NIK/ID Pasangan?
        bin_mempelai2: '',
        tmp_lahir_mempelai2: '',
        tgl_lahir_mempelai2: '',
        agama_mempelai2: '',
        wn_mempelai2: 'WNI',
        pekerjaan_mempelai2: '',
        status_mempelai2: '',
        alamat_mempelai2: '',
        
        // Acara
        hari_nikah: '',
        tgl_nikah: '',
        alamat_nikah: '',
        alasan: '',
        
        // Dokumen
        ktp_pria: null as File | null,
        ktp_wanita: null as File | null,
        bukti_pendaftaran: null as File | null,
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
            <div className="rounded-lg border border-pink-100 bg-pink-50 p-4">
                <div className="flex items-start gap-3">
                    <Heart className="mt-0.5 h-5 w-5 text-pink-600" />
                    <div className="text-sm text-pink-900">
                        <p className="font-semibold">Persyaratan Layanan Nikah (N.A):</p>
                        <ul className="mt-1 list-inside list-disc space-y-1 text-pink-800">
                            <li>Layanan ini untuk mengajukan N1 (Surat Keterangan Untuk Nikah).</li>
                            <li>Pastikan data kedua mempelai diisi dengan lengkap dan benar sesuai KTP.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Section: Wilayah */}
            <div>
                 <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    Data Wilayah
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

            {/* Section: Mempelai Pria */}
            <div className="border-t border-gray-100 pt-6">
                 <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <User className="mr-2 h-4 w-4" />
                    Data Mempelai Pria (Pemohon)
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                        <Label htmlFor="calon_mempelai1" className="text-xs text-gray-500">Nama Lengkap</Label>
                        <Input
                            id="calon_mempelai1"
                            value={data.calon_mempelai1}
                            onChange={(e) => setData('calon_mempelai1', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="bin_mempelai1" className="text-xs text-gray-500">Bin (Nama Ayah)</Label>
                        <Input
                            id="bin_mempelai1"
                            value={data.bin_mempelai1}
                            onChange={(e) => setData('bin_mempelai1', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="status_mempelai1" className="text-xs text-gray-500">Status Perkawinan</Label>
                        <Select
                            value={data.status_mempelai1}
                            onValueChange={(val) => setData('status_mempelai1', val)}
                        >
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Pilih Status..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Jejaka">Jejaka</SelectItem>
                                <SelectItem value="Duda">Duda</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Section: Mempelai Wanita */}
            <div className="border-t border-gray-100 pt-6">
                <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <Heart className="mr-2 h-4 w-4" />
                    Data Mempelai Wanita
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-1 lg:col-span-2">
                        <Label htmlFor="nama_mempelai2" className="text-xs text-gray-500">Nama Lengkap</Label>
                        <Input
                            id="nama_mempelai2"
                            value={data.nama_mempelai2}
                            onChange={(e) => setData('nama_mempelai2', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="bin_mempelai2" className="text-xs text-gray-500">Binti (Nama Ayah)</Label>
                        <Input
                            id="bin_mempelai2"
                            value={data.bin_mempelai2}
                            onChange={(e) => setData('bin_mempelai2', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="calon_mempelai2" className="text-xs text-gray-500">NIK / Identitas</Label>
                        <Input
                            id="calon_mempelai2"
                            value={data.calon_mempelai2}
                            onChange={(e) => setData('calon_mempelai2', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="tmp_lahir_mempelai2" className="text-xs text-gray-500">Tempat Lahir</Label>
                        <Input
                            id="tmp_lahir_mempelai2"
                            value={data.tmp_lahir_mempelai2}
                            onChange={(e) => setData('tmp_lahir_mempelai2', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="tgl_lahir_mempelai2" className="text-xs text-gray-500">Tanggal Lahir</Label>
                        <Input
                            id="tgl_lahir_mempelai2"
                            type="date"
                            value={data.tgl_lahir_mempelai2}
                            onChange={(e) => setData('tgl_lahir_mempelai2', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="agama_mempelai2" className="text-xs text-gray-500">Agama</Label>
                         <Select
                            value={data.agama_mempelai2}
                            onValueChange={(val) => setData('agama_mempelai2', val)}
                        >
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Pilih Agama..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Islam">Islam</SelectItem>
                                <SelectItem value="Kristen">Kristen</SelectItem>
                                <SelectItem value="Katolik">Katolik</SelectItem>
                                <SelectItem value="Hindu">Hindu</SelectItem>
                                <SelectItem value="Buddha">Buddha</SelectItem>
                                <SelectItem value="Konghucu">Konghucu</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="wn_mempelai2" className="text-xs text-gray-500">Warga Negara</Label>
                        <Input
                            id="wn_mempelai2"
                            value={data.wn_mempelai2}
                            onChange={(e) => setData('wn_mempelai2', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="pekerjaan_mempelai2" className="text-xs text-gray-500">Pekerjaan</Label>
                         <Input
                            id="pekerjaan_mempelai2"
                            value={data.pekerjaan_mempelai2}
                            onChange={(e) => setData('pekerjaan_mempelai2', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="status_mempelai2" className="text-xs text-gray-500">Status</Label>
                         <Select
                            value={data.status_mempelai2}
                            onValueChange={(val) => setData('status_mempelai2', val)}
                        >
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Pilih Status..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Perawan">Perawan</SelectItem>
                                <SelectItem value="Janda">Janda</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1 lg:col-span-2">
                        <Label htmlFor="alamat_mempelai2" className="text-xs text-gray-500">Alamat Lengkap</Label>
                        <Input
                            id="alamat_mempelai2"
                             value={data.alamat_mempelai2}
                            onChange={(e) => setData('alamat_mempelai2', e.target.value)}
                            className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            required
                        />
                    </div>
                </div>
            </div>

             {/* Section: Rencana Pernikahan */}
            <div className="border-t border-gray-100 pt-6">
                 <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    Rencana Pernikahan
                </h3>
                 <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-1">
                         <Label htmlFor="hari_nikah" className="text-xs text-gray-500">Hari</Label>
                          <Select
                             value={data.hari_nikah}
                             onValueChange={(val) => setData('hari_nikah', val)}
                         >
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Pilih Hari..." />
                            </SelectTrigger>
                            <SelectContent>
                                {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map(day => (
                                    <SelectItem key={day} value={day}>{day}</SelectItem>
                                ))}
                            </SelectContent>
                         </Select>
                     </div>
                      <div className="space-y-1">
                         <Label htmlFor="tgl_nikah" className="text-xs text-gray-500">Tanggal</Label>
                         <Input
                             id="tgl_nikah"
                             type="date"
                             value={data.tgl_nikah}
                             onChange={(e) => setData('tgl_nikah', e.target.value)}
                             className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                             required
                         />
                     </div>
                      <div className="space-y-1">
                         <Label htmlFor="alamat_nikah" className="text-xs text-gray-500">Tempat / Alamat Nikah</Label>
                          <Input
                             id="alamat_nikah"
                             value={data.alamat_nikah}
                             onChange={(e) => setData('alamat_nikah', e.target.value)}
                             className="h-9 border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                             required
                         />
                     </div>
                 </div>
                  <div className="mt-4 space-y-1">
                     <Label htmlFor="alasan" className="text-xs text-gray-500">Alasan / Keterangan (Opsional)</Label>
                     <Textarea
                         id="alasan"
                         value={data.alasan}
                         onChange={(e) => setData('alasan', e.target.value)}
                         className="border-gray-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                         rows={2}
                     />
                 </div>
            </div>

            {/* Section: Dokumen */}
            <div className="border-t border-gray-100 pt-6">
                <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                    <Upload className="mr-2 h-4 w-4" />
                    Dokumen Persyaratan
                </h3>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                     <FileUpload
                        label="KTP Pria"
                        id="ktp_pria"
                        file={data.ktp_pria}
                        onChange={(f) => setData('ktp_pria', f)}
                        error={errors.ktp_pria}
                        required
                    />
                     <FileUpload
                        label="KTP Wanita"
                        id="ktp_wanita"
                        file={data.ktp_wanita}
                        onChange={(f) => setData('ktp_wanita', f)}
                        error={errors.ktp_wanita}
                        required
                    />
                    <FileUpload
                        label="Bukti Pendaftaran (Opsional)"
                        id="bukti_pendaftaran"
                         file={data.bukti_pendaftaran}
                        onChange={(f) => setData('bukti_pendaftaran', f)}
                        error={errors.bukti_pendaftaran}
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
