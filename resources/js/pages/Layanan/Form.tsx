import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, Info, Lock, CheckCircle2, Shield, Search, Sparkles, BadgeCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import PublicNavbar from '@/components/public-navbar';

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

        return (
            <div className="p-8 text-center text-slate-500 text-sm">
                Formulir untuk layanan ini belum tersedia.
            </div>
        );
    };

    if (success) {
        return (
            <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
                <Head>
                    <title>{`Permohonan Berhasil - ${layanan.nama_layanan} | SIPADU Cianjur`}</title>
                    <meta name="description" content={`Permohonan ${layanan.nama_layanan} Anda telah berhasil diajukan melalui SIPADU Kabupaten Cianjur.`} />
                    <meta name="robots" content="noindex, nofollow" />
                </Head>

                {/* Background */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
                </div>

                {/* Navbar */}
                <PublicNavbar />

                <div className="relative z-10 flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-12">
                    <div className="w-full max-w-lg">
                        <div className="rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 shadow-2xl shadow-emerald-100/50 dark:shadow-none backdrop-blur-xl text-center">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
                            </div>

                            <h2 className="mb-2 text-2xl font-extrabold text-slate-900 dark:text-white">Permohonan Berhasil!</h2>
                            <p className="mb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Permohonan <strong>{layanan.nama_layanan}</strong> telah dikirim dan sedang diverifikasi.
                            </p>

                            {/* Token */}
                            <div className="mb-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                                <div className="mb-2 flex items-center justify-center gap-2">
                                    <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-400">Token Permohonan</h3>
                                </div>
                                <div className="mb-3 rounded-xl bg-white dark:bg-slate-950 p-4 border border-emerald-200 dark:border-emerald-900/50">
                                    <div className="text-3xl font-extrabold font-mono tracking-widest text-emerald-600 dark:text-emerald-500">{token}</div>
                                </div>
                                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                                    <strong>PENTING:</strong> Simpan token ini untuk melacak status
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a
                                    href={`/tracking?token=${token}`}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
                                >
                                    <Search className="h-4 w-4" />
                                    Lacak Permohonan
                                </a>
                                <a
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-transparent px-6 py-3 text-sm font-bold text-slate-900 dark:text-white transition-all hover:bg-slate-900 dark:hover:bg-slate-800 hover:text-white hover:-translate-y-0.5"
                                >
                                    Kembali ke Beranda
                                </a>
                            </div>

                            {/* Info */}
                            <div className="mt-8 rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 p-4 text-left">
                                <h4 className="mb-2 text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider">Langkah Selanjutnya:</h4>
                                <ul className="space-y-1.5 text-sm text-blue-700 dark:text-blue-300">
                                    <li>• Verifikasi dalam 1-3 hari kerja</li>
                                    <li>• Notifikasi email jika ada update</li>
                                    <li>• Gunakan token untuk melacak progress</li>
                                    <li>• Pastikan data valid dan dapat dihubungi</li>
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
            <Head>
                <title>{`${layanan.nama_layanan} - Formulir Permohonan | SIPADU Cianjur`}</title>
                <meta name="description" content={`Ajukan permohonan ${layanan.nama_layanan} secara online melalui SIPADU Kabupaten Cianjur. Aman, cepat, dan tanpa antri.`} />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
                {/* Background */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
                </div>

                {/* Navbar */}
                <PublicNavbar showBack={true} />

                <main className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        {!isAuthenticated ? (
                            <>
                                <div className="mb-6 text-center">
                                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{layanan.nama_layanan}</h1>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{layanan.deskripsi}</p>
                                </div>

                                <div className="max-w-lg mx-auto rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 shadow-2xl shadow-amber-100/50 dark:shadow-none backdrop-blur-xl">
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30">
                                            <Lock className="h-7 w-7 text-amber-600 dark:text-amber-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-extrabold text-amber-950 dark:text-amber-400">Akses Terbatas</h3>
                                            <p className="mt-2 text-sm text-amber-900/80 dark:text-amber-300/80 max-w-md">
                                                Login terlebih dahulu sebelum mengajukan permohonan layanan ini.
                                            </p>
                                        </div>
                                        <a
                                            href="/login"
                                            className="inline-flex items-center justify-center rounded-xl bg-amber-600 dark:bg-amber-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-amber-700 dark:hover:bg-amber-600 hover:-translate-y-0.5 shadow-xl shadow-amber-600/20"
                                        >
                                            Login Sekarang
                                        </a>
                                    </div>
                                </div>
                            </>
                        ) : !layanan.is_active ? (
                            <>
                                <div className="mb-6 text-center">
                                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{layanan.nama_layanan}</h1>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{layanan.deskripsi}</p>
                                </div>

                                <div className="max-w-lg mx-auto rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 shadow-2xl shadow-red-100/50 dark:shadow-none backdrop-blur-xl">
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
                                            <Lock className="h-7 w-7 text-red-600 dark:text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-extrabold text-red-950 dark:text-red-400">Layanan Non-Aktif</h3>
                                            <p className="mt-2 text-sm text-red-900/80 dark:text-red-300/80 max-w-md">
                                                {layanan.informasi_status || 'Layanan ini sedang tidak tersedia untuk sementara waktu.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-4">
                                        <BadgeCheck className="h-3.5 w-3.5" />
                                        Formulir Pengajuan
                                    </div>
                                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">{layanan.nama_layanan}</h1>
                                    <p className="max-w-2xl text-base text-slate-600 dark:text-slate-400 leading-relaxed">{layanan.deskripsi}</p>
                                </div>

                                <div className="grid gap-8 lg:grid-cols-3">
                                    {/* Form */}
                                    <div className="lg:col-span-2">
                                        <div className="rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-2xl shadow-emerald-100/50 dark:shadow-none backdrop-blur-xl sm:p-8">
                                            <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Formulir Pengajuan</h2>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Lengkapi seluruh kolom dengan data yang valid.</p>
                                            </div>

                                            {/* Dynamic Form Rendering */}
                                            {renderForm()}
                                        </div>
                                    </div>

                                    {/* Sidebar */}
                                    <div className="space-y-5 lg:sticky lg:top-24 h-fit">
                                        <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-5">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-500">
                                                    <Info className="h-4 w-4" />
                                                </div>
                                                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-400">Informasi Penting</h3>
                                            </div>
                                            <div className="space-y-3">
                                                {['Data harus sesuai dengan KTP/KK asli.', 'Pastikan scan/foto dokumen terlihat jelas.', 'Waktu proses verifikasi 1-3 hari kerja.'].map((text, i) => (
                                                    <div key={i} className="flex gap-3">
                                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">{i + 1}</span>
                                                        <p className="text-sm text-emerald-900/80 dark:text-emerald-300/80">{text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl bg-emerald-600 p-5 text-white shadow-xl shadow-emerald-900/10">
                                            <h3 className="text-sm font-bold mb-2">Butuh Bantuan?</h3>
                                            <p className="text-xs text-emerald-200 leading-relaxed mb-3">
                                                Jika mengalami kendala, silakan hubungi layanan pengaduan kami.
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-emerald-100">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse"></span>
                                                Senin - Jumat | 08:00 - 16:00
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-10 pb-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                            <div>
                                <img src="/logo/sugih-mukti.png" alt="Logo Cianjur" className="h-10 w-auto mb-4 grayscale opacity-90" />
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                                    Pelayanan publik yang transparan, akuntabel, dan efisien untuk masyarakat Cianjur.
                                </p>
                            </div>
                            <div className="flex gap-12">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">Layanan</h4>
                                    <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                        <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Kependudukan</a></li>
                                        <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Perizinan</a></li>
                                        <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Kesehatan</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">Bantuan</h4>
                                    <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                        <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Panduan</a></li>
                                        <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">F.A.Q</a></li>
                                        <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Kontak</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-5 flex items-center justify-between">
                            <div className="text-xs font-medium text-slate-400 dark:text-slate-500">&copy; 2026 SIPADU KAB. CIANJUR</div>
                            <div className="flex gap-2">
                                <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                                <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
