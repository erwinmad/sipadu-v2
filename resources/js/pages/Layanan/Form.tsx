import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, Info, Lock, CheckCircle2, Shield, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import Forms
import DomisiliForm from './Forms/DomisiliForm';
import NikahForm from './Forms/NikahForm';
import SktmForm from './Forms/SktmForm';
import UsahaForm from './Forms/UsahaForm';

interface Layanan {
    id: number;
    nama_layanan: string;
    slug: string;
    deskripsi: string;
    is_active: boolean;
    informasi_status: string | null;
}

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

interface PageProps {
    layanan: Layanan;
    kecamatans: Kecamatan[];
    isAuthenticated: boolean;
}

interface FlashMessages {
    success?: boolean;
    token?: string;
    message?: string;
}

export default function LayananForm({ layanan, kecamatans, isAuthenticated }: PageProps) {
    const { props } = usePage<{ flash: FlashMessages }>();
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        if (props.flash?.success && props.flash?.token) {
            setSuccess(true);
            setToken(props.flash.token);
        }
    }, [props.flash]);

    // Render form based on slug keyword
    const renderForm = () => {
        const slug = layanan.slug.toLowerCase();
        
        const formProps = {
            slug: layanan.slug,
            kecamatans: kecamatans,
            onSuccess: () => setSuccess(true),
        };
        
        if (slug.includes('domisili')) return <DomisiliForm {...formProps} />;
        if (slug.includes('sktm') || slug.includes('tidak-mampu')) return <SktmForm {...formProps} />;
        if (slug.includes('nikah')) return <NikahForm {...formProps} />;
        if (slug.includes('usaha')) return <UsahaForm {...formProps} />;
        
        // Fallback or generic form if needed
        return (
            <div className="p-8 text-center text-gray-500">
                Formulir untuk layanan ini belum tersedia.
            </div>
        );
    };

    if (success) {
        return (
            <div className="relative min-h-screen bg-[#F8FAFC] font-sans">
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
                        </div>
                    </div>
                </nav>

                <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-24">
                    <div className="w-full max-w-2xl">
                        {/* Success Card */}
                        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-lg text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                            </div>
                            
                            <h2 className="mb-3 text-3xl font-black text-slate-900">Permohonan Berhasil Dikirim!</h2>
                            <p className="mb-8 text-base text-slate-600">
                                Terima kasih. Permohonan Anda untuk <strong>{layanan.nama_layanan}</strong> telah berhasil dikirim dan sedang dalam proses verifikasi.
                            </p>

                            {/* Token Display */}
                            <div className="mb-8 rounded-xl border-2 border-emerald-500 bg-emerald-50 p-6">
                                <div className="mb-3 flex items-center justify-center gap-2">
                                    <Shield className="h-5 w-5 text-emerald-600" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900">Token Permohonan Anda</h3>
                                </div>
                                <div className="mb-4 rounded-lg bg-white p-4 border border-emerald-200">
                                    <div className="text-4xl font-black font-mono tracking-widest text-emerald-600">{token}</div>
                                </div>
                                <p className="text-xs font-medium text-emerald-800">
                                    <strong>PENTING:</strong> Simpan token ini dengan baik untuk melacak status permohonan Anda
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a 
                                    href={`/tracking?token=${token}`}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
                                >
                                    <Search className="h-4 w-4" />
                                    Lacak Permohonan
                                </a>
                                <a 
                                    href="/" 
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-900 bg-transparent px-6 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-slate-900 hover:text-white hover:-translate-y-0.5"
                                >
                                    Kembali ke Beranda
                                </a>
                            </div>

                            {/* Info Box */}
                            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4 text-left">
                                <h4 className="mb-2 text-sm font-bold text-blue-900">Langkah Selanjutnya:</h4>
                                <ul className="space-y-1 text-xs text-blue-700">
                                    <li>• Permohonan Anda akan diverifikasi dalam 1-3 hari kerja</li>
                                    <li>• Anda akan menerima notifikasi email jika ada update status</li>
                                    <li>• Gunakan token di atas untuk melacak progress permohonan</li>
                                    <li>• Pastikan data yang Anda berikan valid dan dapat dihubungi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title={`${layanan.nama_layanan} - SIPADU`} />

            <div className="relative min-h-screen bg-[#F8FAFC] font-sans">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                </div>

                {/* Navbar - Consistent with Landing */}
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
                                <a href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 transition-colors hover:text-emerald-700">
                                    <ArrowLeft className="h-3 w-3" />
                                    Beranda
                                </a>
                                <a href="/tracking" className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800">
                                    LACAK
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="relative z-10 pt-24 pb-12 lg:pt-28 lg:pb-16">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="mx-auto max-w-5xl">
                            {!isAuthenticated ? (
                                <>
                                    {/* Header Section - Compact */}
                                    <div className="mb-6 text-center">
                                        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">{layanan.nama_layanan}</h1>
                                        <p className="mt-2 text-sm font-medium text-slate-600">{layanan.deskripsi}</p>
                                    </div>

                                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                                        <div className="flex flex-col items-center gap-4 text-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                                                <Lock className="h-6 w-6 text-amber-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-amber-950">Akses Terbatas</h3>
                                                <p className="mt-2 text-sm text-amber-900/80 max-w-md">
                                                    Untuk menjamin keamanan dan validitas data, Anda diwajibkan untuk login terlebih dahulu sebelum mengajukan permohonan layanan ini.
                                                </p>
                                            </div>
                                            <a 
                                                href="/login" 
                                                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-amber-700 hover:-translate-y-0.5"
                                            >
                                                Login Sekarang
                                            </a>
                                        </div>
                                    </div>
                                </>
                            ) : !layanan.is_active ? (
                                <>
                                    {/* Header Section - Compact */}
                                    <div className="mb-6 text-center">
                                        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">{layanan.nama_layanan}</h1>
                                        <p className="mt-2 text-sm font-medium text-slate-600">{layanan.deskripsi}</p>
                                    </div>

                                    <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
                                        <div className="flex flex-col items-center gap-4 text-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                                <Lock className="h-6 w-6 text-red-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-red-950">Layanan Non-Aktif</h3>
                                                <p className="mt-2 text-sm text-red-900/80 max-w-md">
                                                    {layanan.informasi_status || 'Mohon maaf, layanan ini sedang tidak tersedia untuk sementara waktu.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Header Section - Full */}
                                    <div className="mb-8 text-center lg:text-left">
                                        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">{layanan.nama_layanan}</h1>
                                        <p className="mt-3 max-w-2xl text-base font-medium text-slate-600">{layanan.deskripsi}</p>
                                    </div>

                                    <div className="grid gap-8 lg:grid-cols-3 xl:gap-12">
                                    {/* Left Column: Form */}
                                    <div className="lg:col-span-2">
                                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
                                            <div className="mb-8 border-b border-slate-100 pb-6">
                                                <h2 className="text-xl font-bold text-slate-900">Formulir Pengajuan</h2>
                                                <p className="mt-2 text-sm text-slate-500">Lengkapi seluruh kolom dengan data yang valid dan dapat dipertanggungjawabkan.</p>
                                            </div>
                                            
                                            {/* Dynamic Form Rendering */}
                                            {renderForm()}
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
                                                    <p className="text-sm font-medium text-emerald-900/80">Data yang diinput harus sesuai dengan KTP/KK asli.</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">2</span>
                                                    <p className="text-sm font-medium text-emerald-900/80">Pastikan scan/foto dokumen terlihat jelas dan tidak buram.</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">3</span>
                                                    <p className="text-sm font-medium text-emerald-900/80">Waktu proses verifikasi 1-3 hari kerja.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                            <h3 className="flex items-center gap-2 font-bold text-slate-900">
                                                Butuh Bantuan?
                                            </h3>
                                            <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                                Jika Anda mengalami kendala teknis atau memiliki pertanyaan, silakan hubungi layanan pengaduan kami.
                                            </p>
                                            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                                Senin - Jumat | 08:00 - 16:00
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer - Consistent with Landing */}
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
                                        <li><a href="#" className="hover:text-emerald-600">Kesehatan</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Bantuan</h4>
                                    <ul className="space-y-2 text-xs font-medium text-slate-500">
                                        <li><a href="#" className="hover:text-emerald-600">Panduan</a></li>
                                        <li><a href="#" className="hover:text-emerald-600">F.A.Q</a></li>
                                        <li><a href="#" className="hover:text-emerald-600">Kontak Kami</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-[10px] font-bold text-slate-400">
                                &copy; 2026 SIPADU KAB. CIANJUR
                            </div>
                            <div className="flex gap-3">
                                {/* Social icons placeholder */}
                                <div className="h-6 w-6 rounded-full bg-slate-50"></div>
                                <div className="h-6 w-6 rounded-full bg-slate-50"></div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
