import { Head, useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormEventHandler, useRef, useState, useEffect } from 'react';
import { User, MapPin, GraduationCap, Upload, Info, X, Camera, RefreshCw, CheckCircle2 as CheckIcon, ShieldCheck, ChevronRight, BadgeCheck, Sparkles, Phone, BookOpen, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import PublicNavbar from '@/components/public-navbar';


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
    verificationStatus?: 'pending' | 'verified' | 'rejected' | null;
    verificationNote?: string | null;
}

export default function Complete({ kecamatans, detailUser, verificationStatus, verificationNote }: Props) {
    const isProfileComplete = detailUser?.nik && detailUser?.foto_ktp && detailUser?.foto_verifikasi;
    const isPending = verificationStatus === 'pending' && isProfileComplete;
    const isVerified = verificationStatus === 'verified';
    const isRejected = verificationStatus === 'rejected';

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
        
        // Manual check for files
        if (!data.foto_ktp || !data.foto_verifikasi) {
             if (!data.foto_ktp) alert("Mohon upload Scan KTP terlebih dahulu.");
             else if (!data.foto_verifikasi) alert("Mohon ambil Foto Verifikasi Wajah terlebih dahulu.");
             return;
        }

        post('/users/pengguna', {
            forceFormData: true,
            onError: (errors) => {
                console.error("Submission errors:", errors);
            },
        });
    };

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-100 selection:text-emerald-700 text-slate-900 dark:text-slate-50">
            <Head>
                <title>Lengkapi Profil Anda - SIPADU Kabupaten Cianjur</title>
                <meta name="description" content="Lengkapi data diri Anda untuk dapat menggunakan layanan SIPADU Kabupaten Cianjur." />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            {/* Clean Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            <div className="relative z-10 flex min-h-screen flex-col">
                {/* Navbar Minimalis */}
                <PublicNavbar subtitle="Onboarding" />

                <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">

                        {/* === Verification Status Banner === */}
                        {isPending && (
                            <div className="mb-8 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-6 shadow-lg shadow-amber-100/30 dark:shadow-none">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50 shrink-0">
                                        <Clock className="h-6 w-6 text-amber-600 dark:text-amber-500 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400">Profil Sedang Diverifikasi</h3>
                                        <p className="text-sm text-amber-700/80 dark:text-amber-500/80 mt-1 leading-relaxed">
                                            Data Anda sedang dalam proses verifikasi oleh admin kecamatan. Anda akan dapat mengajukan layanan setelah profil diverifikasi. Proses ini biasanya membutuhkan waktu 1-2 hari kerja.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isVerified && (
                            <div className="mb-8 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 p-6 shadow-lg shadow-emerald-100/30 dark:shadow-none">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50 shrink-0">
                                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400">Profil Terverifikasi ✓</h3>
                                        <p className="text-sm text-emerald-700/80 dark:text-emerald-500/80 mt-1 leading-relaxed">
                                            Selamat! Profil Anda telah diverifikasi oleh admin kecamatan. Anda sekarang dapat mengajukan layanan.
                                        </p>
                                        <Link
                                            href="/"
                                            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold transition-colors shadow-sm"
                                        >
                                            Ajukan Layanan <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isRejected && (
                            <div className="mb-8 rounded-2xl border border-red-200 dark:border-red-900/50 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/20 p-6 shadow-lg shadow-red-100/30 dark:shadow-none">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/50 shrink-0">
                                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-red-800 dark:text-red-400">Profil Ditolak</h3>
                                        <p className="text-sm text-red-700/80 dark:text-red-500/80 mt-1 leading-relaxed">
                                            Mohon maaf, profil Anda ditolak oleh admin kecamatan. Silakan perbaiki data Anda dan upload ulang dokumen.
                                        </p>
                                        {verificationNote && (
                                            <div className="mt-3 rounded-lg bg-red-100/50 dark:bg-red-900/30 border border-red-200/50 dark:border-red-800/50 p-3">
                                                <p className="text-xs font-semibold text-red-800 dark:text-red-400 mb-1">Alasan Penolakan:</p>
                                                <p className="text-sm text-red-700 dark:text-red-400 italic">"{verificationNote}"</p>
                                            </div>
                                        )}
                                        <p className="mt-3 text-xs text-red-600/70 dark:text-red-500/70">
                                            Silakan perbaiki data di bawah ini lalu kirim ulang.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-12 lg:grid-cols-12">
                            
                            {/* Left Column: Welcome & Value Prop (SaaS Style) */}
                            <div className="lg:col-span-4 lg:py-8 space-y-8">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-6">
                                        <BadgeCheck className="h-3.5 w-3.5" />
                                        Verifikasi Akun
                                    </div>
                                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-5xl mb-4">
                                        Selamat Datang di <span className="text-emerald-600 dark:text-emerald-500">Sipadu</span>
                                    </h1>
                                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Mari lengkapi profil Anda untuk membuka akses penuh ke layanan publik digital Kabupaten Cianjur yang cepat dan transparan.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <FeatureItem 
                                        icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
                                        title="Keamanan Terjamin"
                                        desc="Data Anda dienkripsi dan dilindungi dengan standar keamanan tinggi."
                                    />
                                    <FeatureItem 
                                        icon={<ZapIcon className="h-5 w-5 text-emerald-600" />}
                                        title="Layanan Instan"
                                        desc="Ajukan surat dan perizinan tanpa perlu antre di kantor fisik."
                                    />
                                    <FeatureItem 
                                        icon={<FolderIcon className="h-5 w-5 text-emerald-600" />}
                                        title="Arsip Digital"
                                        desc="Dokumen Anda tersimpan rapi dan dapat diakses kapan saja."
                                    />
                                </div>

                                <div className="rounded-2xl bg-emerald-600 p-6 text-white shadow-xl shadow-emerald-900/10">
                                    <p className="text-sm font-medium text-emerald-100 mb-2">Butuh Bantuan?</p>
                                    <p className="text-xs text-emerald-200 mb-4">Tim support kami siap membantu Anda 24/7 jika mengalami kendala.</p>
                                    <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/20">
                                        Hubungi Admin
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Form Card */}
                            <div className="lg:col-span-8">
                                <div className="rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-2xl shadow-emerald-100/50 dark:shadow-none backdrop-blur-xl sm:p-10">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Formulir Data Diri</h2>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1">Lengkapi informasi di bawah ini dengan benar.</p>
                                    </div>

                                    {isPending && (
                                        <div className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 text-center">
                                            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">⏳ Data Anda sedang diverifikasi oleh admin — formulir ini tidak dapat diedit.</p>
                                        </div>
                                    )}

                                    <form onSubmit={submit} className="space-y-10">
                                        
                                        {/* Section 1 */}
                                        <section className="space-y-6">
                                            <SectionHeader title="Informasi Personal" icon={<User className="h-4 w-4" />} />
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <FormInput label="NIK (Nomor Induk Kependudukan)" id="nik" value={data.nik} onChange={(v: string) => setData('nik', v)} required maxLength={16} placeholder="16 digit angka" error={errors.nik} />
                                                <FormInput label="No. WhatsApp Aktif" id="no_telepon" value={data.no_telepon} onChange={(v: string) => setData('no_telepon', v)} required placeholder="Contoh: 08123456789" error={errors.no_telepon} />
                                                <FormInput label="Tempat Lahir" id="tempat_lahir" value={data.tempat_lahir} onChange={(v: string) => setData('tempat_lahir', v)} />
                                                <div className="space-y-2">
                                                    <Label htmlFor="tanggal_lahir" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tanggal Lahir</Label>
                                                    <Input id="tanggal_lahir" type="date" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all dark:text-white" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jenis Kelamin</Label>
                                                    <Select value={data.jenis_kelamin} onValueChange={(v: string) => setData('jenis_kelamin', v)}>
                                                        <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all dark:text-white"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                                        <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                                                            <SelectItem value="L">Laki-laki</SelectItem>
                                                            <SelectItem value="P">Perempuan</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Section 2 */}
                                        <section className="space-y-6">
                                            <SectionHeader title="Alamat & Lokasi" icon={<MapPin className="h-4 w-4" />} />
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kecamatan</Label>
                                                    <Select value={data.kode_kecamatan} onValueChange={(v) => setData(p => ({ ...p, kode_kecamatan: v, kode_desa: '' }))}>
                                                        <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 dark:text-white"><SelectValue placeholder="Pilih Kecamatan" /></SelectTrigger>
                                                        <SelectContent className="dark:bg-slate-900 dark:border-slate-800">{kecamatans.map(k => <SelectItem key={k.id} value={k.id}>{k.nama_kecamatan}</SelectItem>)}</SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Desa/Kelurahan</Label>
                                                    <Select value={data.kode_desa} onValueChange={(v) => setData('kode_desa', v)} disabled={!data.kode_kecamatan}>
                                                        <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 dark:text-white"><SelectValue placeholder="Pilih Desa" /></SelectTrigger>
                                                        <SelectContent className="dark:bg-slate-900 dark:border-slate-800">{kecamatans.find(k => k.id === data.kode_kecamatan)?.desas.map(d => <SelectItem key={d.id} value={d.id}>{d.nama_desa}</SelectItem>)}</SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <Label htmlFor="alamat" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Alamat Lengkap (Jalan, RT/RW)</Label>
                                                    <Textarea id="alamat" rows={3} value={data.alamat} onChange={e => setData('alamat', e.target.value)} className="min-h-[80px] rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all font-medium dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" placeholder="Contoh: Jl. Merdeka No. 10, RT 01/05" />
                                                </div>
                                            </div>
                                        </section>

                                        {/* Section 3 */}
                                        <section className="space-y-6">
                                            <SectionHeader title="Pendidikan & Pekerjaan" icon={<GraduationCap className="h-4 w-4" />} />
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pendidikan Terakhir</Label>
                                                    <Select value={data.pendidikan_terakhir} onValueChange={(v) => setData('pendidikan_terakhir', v)}>
                                                        <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 dark:text-white"><SelectValue placeholder="Pilih..." /></SelectTrigger>
                                                        <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                                                            {['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <FormInput label="Pekerjaan Saat Ini" id="pekerjaan" value={data.pekerjaan} onChange={(v: string) => setData('pekerjaan', v)} />
                                            </div>
                                        </section>

                                        {/* Section 4: Verification */}
                                        <section className="space-y-6 pt-4">
                                            <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-6">
                                                <SectionHeader title="Verifikasi Identitas" icon={<BadgeCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />} />
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 mt-2 ml-7">
                                                    Untuk keamanan akun, mohon lampirkan dokumen identitas dan lakukan verifikasi wajah.
                                                </p>

                                                <div className="grid gap-6 md:grid-cols-2">
                                                    <FileUpload 
                                                        label="Upload KTP (Asli)" 
                                                        id="foto_ktp" 
                                                        file={data.foto_ktp} 
                                                        onChange={(f: any) => setData('foto_ktp', f)}
                                                        error={errors.foto_ktp}
                                                    />
                                                    <WebcamCapture 
                                                        label="Verifikasi Wajah (Live)"
                                                        onCapture={(file: any) => setData('foto_verifikasi', file)}
                                                        error={errors.foto_verifikasi}
                                                    />
                                                </div>
                                            </div>
                                        </section>

                                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                                            <p className="text-xs text-slate-400 hidden sm:block">
                                                Dengan melanjutkann, Anda menyetujui <a href="#" className="underline hover:text-emerald-600 dark:hover:text-emerald-400">Kebijakan Privasi</a> kami.
                                            </p>
                                            <button 
                                                type="button"
                                                onClick={(e) => submit(e as any)}
                                                disabled={processing}
                                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-emerald-600/30 disabled:opacity-50 disabled:hover:translate-y-0"
                                            >
                                                {processing ? (
                                                    <RefreshCw className="animate-spin h-5 w-5" />
                                                ) : (
                                                    <>
                                                        Simpan & Lanjutkan
                                                        <ChevronRight className="h-4 w-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// -- Components --

function SectionHeader({ title, icon }: { title: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-500">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        </div>
    );
}

function FormInput({ label, id, value, onChange, type = 'text', required, placeholder, maxLength, error }: any) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <Input 
                id={id} 
                type={type}
                value={value} 
                onChange={(e: any) => onChange(e.target.value)} 
                required={required}
                maxLength={maxLength}
                placeholder={placeholder}
                className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-white" 
            />
            {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
        </div>
    );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="shrink-0 mt-1">{icon}</div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{desc}</p>
            </div>
        </div>
    );
}

// Icons
function ZapIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> }
function FolderIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg> }


function FileUpload({ label, id, file, onChange, error }: any) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</Label>
            {!file ? (
                <div className="group relative overflow-hidden rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-6 transition-all hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-900">
                    <input type="file" accept="image/*,.pdf" onChange={(e) => onChange(e.target.files?.[0])} className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" />
                    <div className="text-center">
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500 transition-transform group-hover:scale-110">
                            <Upload className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Klik untuk upload</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-500">JPG/PDF (Max 2MB)</p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-500">
                            <CheckIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{file.name}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Berkas siap diunggah</p>
                        </div>
                    </div>
                    <button type="button" onClick={() => onChange(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500"><X className="h-4 w-4" /></button>
                </div>
            )}
             {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
        </div>
    );
}

function WebcamCapture({ label, onCapture, error }: any) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [streamError, setStreamError] = useState<string | null>(null);

    useEffect(() => {
        if (isStreaming && mediaStream && videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(e => console.error("Video play:", e));
        }
    }, [isStreaming, mediaStream]);

    useEffect(() => {
        return () => mediaStream?.getTracks().forEach(track => track.stop());
    }, [mediaStream]);

    const startCamera = async () => {
        try {
            setStreamError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setMediaStream(stream);
            setIsStreaming(true);
        } catch (err: any) {
            setStreamError("Gagal akses kamera.");
            setIsStreaming(false);
        }
    };

    const stopCamera = () => { mediaStream?.getTracks().forEach(track => track.stop()); setMediaStream(null); setIsStreaming(false); };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const v = videoRef.current, c = canvasRef.current;
            c.width = v.videoWidth; c.height = v.videoHeight;
            const ctx = c.getContext('2d');
            if (ctx) {
                ctx.translate(c.width, 0); ctx.scale(-1, 1);
                ctx.drawImage(v, 0, 0, c.width, c.height);
                c.toBlob(blob => {
                    if (blob) {
                        onCapture(new File([blob], "face.jpg", { type: "image/jpeg" }));
                        setCapturedImage(c.toDataURL('image/jpeg'));
                        stopCamera();
                    }
                }, 'image/jpeg', 0.8);
            }
        }
    };

    return (
        <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</Label>
            <div className="relative overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-900 shadow-inner min-h-[180px]">
                {!isStreaming && !capturedImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500">
                            <Camera className="h-6 w-6" />
                        </div>
                        <button type="button" onClick={startCamera} className="rounded-lg bg-slate-900 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-colors">
                            Aktifkan Kamera
                        </button>
                        {streamError && <p className="mt-2 text-[10px] text-red-500 font-medium">{streamError}</p>}
                    </div>
                )}
                {isStreaming && !capturedImage && (
                    <div className="relative h-full w-full bg-black">
                        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover transform scale-x-[-1]" />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                            <button type="button" onClick={capturePhoto} className="h-12 w-12 rounded-full border-4 border-white bg-emerald-600 shadow-lg hover:bg-emerald-700 transition-transform active:scale-95"></button>
                        </div>
                    </div>
                )}
                {capturedImage && (
                    <div className="relative h-full w-full">
                         <img src={capturedImage} alt="Captured" className="h-full w-full object-cover" />
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10">
                            <button type="button" onClick={() => { setCapturedImage(null); onCapture(null); startCamera(); }} className="rounded-lg bg-white/90 px-4 py-2 text-xs font-bold text-slate-900 shadow-lg backdrop-blur hover:bg-white">
                                Foto Ulang
                            </button>
                         </div>
                         <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full shadow-md z-20"><CheckIcon className="h-4 w-4" /></div>
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>
            {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
        </div>
    );
}

