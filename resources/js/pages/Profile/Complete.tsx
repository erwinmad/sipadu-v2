import { Head, useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormEventHandler, useRef, useState, useEffect } from 'react';
import { User, MapPin, GraduationCap, Upload, Info, X, ArrowLeft, Camera, RefreshCw, CheckCircle2 as CheckIcon, ShieldCheck } from 'lucide-react';


interface Desa {
    id: string;
    nama_desa: string;
}

interface Kecamatan {
    id: string;
    nama_kecamatan: string;
    desas: Desa[];
}

interface DetailUser {
    nik?: string;
    no_telepon?: string;
    alamat?: string;
    kode_kecamatan?: string;
    kode_desa?: string;
    pendidikan_terakhir?: string;
    pekerjaan?: string;
    tanggal_lahir?: string;
    tempat_lahir?: string;
    jenis_kelamin?: string;
    foto_ktp?: string;
    foto_verifikasi?: string;
}

interface Props {
    kecamatans: Kecamatan[];
    detailUser?: DetailUser;
}

export default function Complete({ kecamatans, detailUser }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        nik: detailUser?.nik || '',
        no_telepon: detailUser?.no_telepon || '',
        alamat: detailUser?.alamat || '',
        kode_kecamatan: detailUser?.kode_kecamatan || '',
        kode_desa: detailUser?.kode_desa || '',
        pendidikan_terakhir: detailUser?.pendidikan_terakhir || '',
        pekerjaan: detailUser?.pekerjaan || '',
        tanggal_lahir: detailUser?.tanggal_lahir || '',
        tempat_lahir: detailUser?.tempat_lahir || '',
        jenis_kelamin: detailUser?.jenis_kelamin || '',
        foto_ktp: null as File | null,
        foto_verifikasi: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Manual check for files because HTML5 validation on custom components can be tricky
        if (!data.foto_ktp || !data.foto_verifikasi) {
             // Let backend validation handle the specific error messages, 
             // but we ensure the request is sent even if browser thinks it's invalid
             // Actually, better to alert user if files are missing visually
             if (!data.foto_ktp) alert("Mohon upload Scan KTP terlebih dahulu.");
             else if (!data.foto_verifikasi) alert("Mohon ambil Foto Verifikasi Wajah terlebih dahulu.");
             return;
        }

        post('/profile/complete', {
            forceFormData: true,
            onError: (errors) => {
                console.error("Submission errors:", errors);
                // Optional: Scroll to first error?
            },
            onFinish: () => {
                // processing will be false
            }
        });
    };

    return (
        <div className="relative min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            <Head title="Lengkapi Profil" />

            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" 
                style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            {/* Navbar */}
            <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-3 lg:px-8">
                <div className="mx-auto max-w-7xl rounded-xl border border-white/40 bg-white/80 px-5 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <img src="/logo/sugih-mukti.png" alt="Logo Cianjur" className="h-8 w-auto drop-shadow-sm" />
                            <div className="hidden sm:block">
                                <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">SIPADU</h1>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">Kabupaten Cianjur</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 transition-colors hover:text-emerald-700">
                                <ArrowLeft className="h-3 w-3" />
                                Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 pt-24 pb-12 lg:pt-28 lg:pb-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="mx-auto max-w-5xl">

                        {/* Header Section */}
                        <div className="mb-8 text-center lg:text-left">
                            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">Lengkapi Profil Anda</h1>
                            <p className="mt-3 max-w-2xl text-base font-medium text-slate-600">Mohon lengkapi biodata diri Anda untuk dapat mengajukan layanan administrasi secara online.</p>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3 xl:gap-12">
                            {/* Left Column: Form */}
                            <div className="lg:col-span-2">
                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
                                    <div className="mb-8 border-b border-slate-100 pb-6">
                                        <h2 className="text-xl font-bold text-slate-900">Formulir Profil</h2>
                                        <p className="mt-2 text-sm text-slate-500">Lengkapi data pribadi dan verifikasi identitas Anda.</p>
                                    </div>

                                    <form onSubmit={submit} className="space-y-8">
                                        
                                        {/* Data Pribadi */}
                                        <div>
                                            <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                                                <User className="mr-2 h-4 w-4" />
                                                Data Pribadi
                                            </h3>
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-1">
                                                    <Label htmlFor="nik" className="text-xs text-gray-500">NIK <span className="text-red-500">*</span></Label>
                                                    <Input id="nik" value={data.nik} onChange={(e) => setData('nik', e.target.value)} 
                                                        maxLength={16} required className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500" placeholder="16 digit NIK" />
                                                    {errors.nik && <p className="text-xs text-red-600">{errors.nik}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="no_telepon" className="text-xs text-gray-500">No. WhatsApp <span className="text-red-500">*</span></Label>
                                                    <Input id="no_telepon" value={data.no_telepon} onChange={(e) => setData('no_telepon', e.target.value)} 
                                                        required className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500" placeholder="08xxxxxxxxxx" />
                                                    {errors.no_telepon && <p className="text-xs text-red-600">{errors.no_telepon}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="tempat_lahir" className="text-xs text-gray-500">Tempat Lahir</Label>
                                                    <Input id="tempat_lahir" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} 
                                                        className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="tanggal_lahir" className="text-xs text-gray-500">Tanggal Lahir</Label>
                                                    <Input id="tanggal_lahir" type="date" value={data.tanggal_lahir} 
                                                        onChange={(e) => setData('tanggal_lahir', e.target.value)} className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="jenis_kelamin" className="text-xs text-gray-500">Jenis Kelamin</Label>
                                                    <Select value={data.jenis_kelamin} onValueChange={(value) => setData('jenis_kelamin', value)}>
                                                        <SelectTrigger className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                                                            <SelectValue placeholder="Pilih Jenis Kelamin" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="L">Laki-laki</SelectItem>
                                                            <SelectItem value="P">Perempuan</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Alamat */}
                                        <div>
                                            <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                                                <MapPin className="mr-2 h-4 w-4" />
                                                Alamat Domisili
                                            </h3>
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-1">
                                                    <Label htmlFor="kode_kecamatan" className="text-xs text-gray-500">Kecamatan <span className="text-red-500">*</span></Label>
                                                    <Select value={data.kode_kecamatan} onValueChange={(value) => setData(prev => ({ ...prev, kode_kecamatan: value, kode_desa: '' }))}>
                                                        <SelectTrigger className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                                                            <SelectValue placeholder="Pilih Kecamatan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {kecamatans.map((kec) => (
                                                                <SelectItem key={kec.id} value={kec.id}>{kec.nama_kecamatan}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.kode_kecamatan && <p className="text-xs text-red-600">{errors.kode_kecamatan}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="kode_desa" className="text-xs text-gray-500">Desa/Kelurahan <span className="text-red-500">*</span></Label>
                                                    <Select value={data.kode_desa} onValueChange={(value) => setData('kode_desa', value)} disabled={!data.kode_kecamatan}>
                                                        <SelectTrigger className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                                                            <SelectValue placeholder="Pilih Desa" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {kecamatans.find(k => k.id === data.kode_kecamatan)?.desas.map((desa) => (
                                                                <SelectItem key={desa.id} value={desa.id}>{desa.nama_desa}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.kode_desa && <p className="text-xs text-red-600">{errors.kode_desa}</p>}
                                                </div>
                                                <div className="md:col-span-2 space-y-1">
                                                    <Label htmlFor="alamat" className="text-xs text-gray-500">Alamat Lengkap (Jalan, RT/RW) <span className="text-red-500">*</span></Label>
                                                    <Textarea id="alamat" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} 
                                                        required rows={2} className="min-h-[80px] border-slate-200 focus:border-emerald-500 focus:ring-emerald-500" placeholder="Jl. Raya Bandung, Kp. Cipanas RT 01/02..." />
                                                    {errors.alamat && <p className="text-xs text-red-600">{errors.alamat}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pendidikan */}
                                        <div>
                                            <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                                                <GraduationCap className="mr-2 h-4 w-4" />
                                                Pendidikan & Pekerjaan
                                            </h3>
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-1">
                                                    <Label htmlFor="pendidikan_terakhir" className="text-xs text-gray-500">Pendidikan Terakhir <span className="text-red-500">*</span></Label>
                                                    <Select value={data.pendidikan_terakhir} onValueChange={(value) => setData('pendidikan_terakhir', value)}>
                                                        <SelectTrigger className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                                                            <SelectValue placeholder="Pilih Pendidikan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="SD">SD</SelectItem>
                                                            <SelectItem value="SMP">SMP</SelectItem>
                                                            <SelectItem value="SMA">SMA/SMK</SelectItem>
                                                            <SelectItem value="D3">D3</SelectItem>
                                                            <SelectItem value="S1">S1</SelectItem>
                                                            <SelectItem value="S2">S2</SelectItem>
                                                            <SelectItem value="S3">S3</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.pendidikan_terakhir && <p className="text-xs text-red-600">{errors.pendidikan_terakhir}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="pekerjaan" className="text-xs text-gray-500">Pekerjaan</Label>
                                                    <Input id="pekerjaan" value={data.pekerjaan} onChange={(e) => setData('pekerjaan', e.target.value)} 
                                                        className="h-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500" placeholder="Wiraswasta / Pegawai Swasta..." />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dokumen & Verifikasi */}
                                        <div>
                                            <h3 className="mb-4 flex items-center text-xs font-bold uppercase tracking-wider text-emerald-600">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Dokumen & Verifikasi
                                            </h3>

                                            {/* Privacy Notice */}
                                            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                                <div className="flex gap-3">
                                                    <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-600 shrink-0" />
                                                    <div className="text-sm text-amber-900">
                                                        <p className="font-bold mb-1">Jaminan Privasi Data</p>
                                                        <p className="leading-relaxed text-xs">
                                                            Foto KTP dan Verifikasi Wajah digunakan untuk validasi identitas (KYC). Foto verifikasi wajah akan dihapus setelah proses selesai.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-4">
                                                    <FileUpload 
                                                        label="Scan KTP (Asli)" 
                                                        id="foto_ktp" 
                                                        file={data.foto_ktp} 
                                                        onChange={(f) => setData('foto_ktp', f)}
                                                        error={errors.foto_ktp}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <WebcamCapture 
                                                        label="Foto Verifikasi Wajah (Live)"
                                                        onCapture={(file) => setData('foto_verifikasi', file)}
                                                        error={errors.foto_verifikasi}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100">
                                            <button type="submit" disabled={processing}
                                                className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:hover:translate-y-0">
                                                {processing ? 'Sedang Menyimpan...' : 'SIMPAN DATA & LANJUTKAN'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Right Column: Sidebar Info - Sticky */}
                            <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                            <Info className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-bold text-emerald-900">Informasi Penting</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">1</span>
                                            <p className="text-sm font-medium text-emerald-900/80">Data NIK harus sesuai KTP Asli (16 digit).</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">2</span>
                                            <p className="text-sm font-medium text-emerald-900/80">Foto Wajah wajib live camera (bukan upload galeri).</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">3</span>
                                            <p className="text-sm font-medium text-emerald-900/80">Data ini akan digunakan otomatis di layanan lain.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h3 className="flex items-center gap-2 font-bold text-slate-900">
                                        Butuh Bantuan?
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                        Jika Anda mengalami kendala saat melengkapi profil, silakan hubungi admin kecamatan atau datang langsung ke kantor desa.
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                        Senin - Jumat | 08:00 - 16:00
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 bg-white border-t border-slate-200 pt-10 pb-6">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                        <div>
                            <img src="/logo/sugih-mukti.png" alt="Logo Cianjur" className="h-10 w-auto mb-4 grayscale opacity-90" />
                            <p className="text-xs font-medium text-slate-500 max-w-xs leading-relaxed">
                                Menghadirkan pelayanan publik yang transparan, akuntabel, dan efisien untuk masyarakat Cianjur.
                            </p>
                        </div>
                        <div className="flex gap-10">
                            <div>
                                <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Layanan</h4>
                                <ul className="space-y-2 text-xs font-medium text-slate-500">
                                    <li><a href="#" className="hover:text-emerald-600">Kependudukan</a></li>
                                    <li><a href="#" className="hover:text-emerald-600">Perizinan</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Bantuan</h4>
                                <ul className="space-y-2 text-xs font-medium text-slate-500">
                                    <li><a href="#" className="hover:text-emerald-600">Panduan</a></li>
                                    <li><a href="#" className="hover:text-emerald-600">Kontak Kami</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-[10px] font-bold text-slate-400">
                            &copy; 2026 SIPADU KAB. CIANJUR
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FileUpload({ label, id, file, onChange, error, required }: { label: string, id: string, file: File | null, onChange: (f: File | null) => void, error?: string, required?: boolean }) {
    return (
        <div className="space-y-1">
            <Label htmlFor={id} className="text-xs text-slate-500">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            {!file ? (
                <div className="group relative overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-emerald-500 hover:bg-emerald-50/50">
                    <input
                        id={id}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => onChange(e.target.files?.[0] || null)}
                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                        required={required}
                    />
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-600">
                            <Upload className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700">Klik untuk upload</p>
                        <p className="mt-0.5 text-[10px] text-slate-500">PDF/JPG (Max 2MB)</p>
                    </div>
                </div>
            ) : (
                <div className="relative flex items-center justify-between overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-xs font-medium text-emerald-900">{file.name}</p>
                            <p className="text-[10px] text-emerald-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => onChange(null)} 
                        className="rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-100 hover:text-emerald-800"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
             {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

function WebcamCapture({ label, onCapture, error, required }: { label: string, onCapture: (file: File | null) => void, error?: string, required?: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [streamError, setStreamError] = useState<string | null>(null);

    // Effect to attach stream to video element once it mounts
    useEffect(() => {
        if (isStreaming && mediaStream && videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            // Ensure video plays (some browsers require explicit play)
            videoRef.current.play().catch(e => console.error("Video play error:", e));
        }
    }, [isStreaming, mediaStream]);

    // Cleanup stream on unmount
    useEffect(() => {
        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            setStreamError(null);
            
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setStreamError('Fitur kamera tidak didukung atau koneksi tidak aman (HTTPS required).');
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
            // Store stream first, set streaming true to mount video element
            setMediaStream(stream);
            setIsStreaming(true);
            
        } catch (err: any) {
            console.error("Camera Error:", err);
            let msg = 'Gagal mengakses kamera.';
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') msg = 'Izin kamera ditolak.';
            else if (err.name === 'NotFoundError') msg = 'Kamera tidak ditemukan.';
            else if (window.isSecureContext === false) msg = 'Browser memblokir kamera di HTTP biasa. Gunakan HTTPS atau localhost.';
            
            setStreamError(msg);
            setIsStreaming(false);
        }
    };

    const stopCamera = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
        setIsStreaming(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const context = canvas.getContext('2d');
            if (context) {
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "verifikasi_wajah.jpg", { type: "image/jpeg" });
                        onCapture(file);
                        setCapturedImage(canvas.toDataURL('image/jpeg'));
                        stopCamera();
                    }
                }, 'image/jpeg', 0.8);
            }
        }
    };

    const retake = () => {
        setCapturedImage(null);
        onCapture(null);
        startCamera();
    };

    return (
        <div className="space-y-1">
            <Label className="text-xs text-slate-500">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            
            <div className="relative overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50">
                {!isStreaming && !capturedImage && (
                    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[160px]">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Camera className="h-5 w-5" />
                        </div>
                        <button 
                            type="button" 
                            onClick={startCamera}
                            className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                        >
                            Buka Kamera
                        </button>
                        <p className="mt-2 text-[10px] text-slate-500 max-w-[150px] mx-auto">Klik untuk ambil foto via kamera</p>
                        {streamError && <p className="mt-2 text-[10px] text-red-600 font-semibold bg-red-50 p-2 rounded">{streamError}</p>}
                    </div>
                )}

                {isStreaming && !capturedImage && (
                    <div className="relative bg-black w-full h-48">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted
                            className="w-full h-full object-cover transform scale-x-[-1]" 
                        />
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
                             <button 
                                type="button" 
                                onClick={capturePhoto}
                                className="bg-white text-emerald-600 hover:bg-slate-100 p-3 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 ring-2 ring-emerald-500/30"
                                title="Ambil Foto"
                            >
                                <Camera className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                {capturedImage && (
                    <div className="relative">
                         <img src={capturedImage} alt="Captured" className="w-full h-48 object-cover" />
                         <div className="absolute bottom-3 left-0 right-0 flex justify-center z-10">
                            <button 
                                type="button" 
                                onClick={retake}
                                className="bg-white/90 text-slate-700 hover:bg-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold flex items-center gap-1 backdrop-blur-sm transition-all hover:-translate-y-0.5"
                            >
                                <RefreshCw className="h-3 w-3" />
                                Ulang
                            </button>
                         </div>
                         <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                             <CheckCircle2 className="h-4 w-4" />
                         </div>
                    </div>
                )}
                
                <canvas ref={canvasRef} className="hidden" />
            </div>
             {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

// CheckCircle2 Alias
function CheckCircle2(props: any) {
    return (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
}
