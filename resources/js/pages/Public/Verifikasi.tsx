import { Head } from '@inertiajs/react';
import PublicNavbar from '@/components/public-navbar';
import PublicFooter from '@/components/public-footer';
import { CheckCircle2, ShieldCheck, MapPin, Calendar, FileText, User, Sparkles, XCircle } from 'lucide-react';

interface Permohonan {
    token: string;
    status: string;
    created_at: string;
    user: {
        name: string;
        detailUser?: {
            nik: string;
        };
    };
    kecamatan: {
        nama_kecamatan: string;
    };
    desa: {
        nama_desa: string;
    };
}

interface PageProps {
    permohonan: Permohonan;
    jenis: string;
}

export default function Verifikasi({ permohonan, jenis }: PageProps) {
    const isValid = permohonan.status === 'selesai';

    const maskName = (name: string) => {
        if (!name) return '';
        return name.split(' ').map(w => w.length > 2 ? w[0] + '*'.repeat(w.length - 2) + w[w.length - 1] : w[0] + '*').join(' ');
    };

    const maskNik = (nik?: string) => {
        if (!nik) return '-';
        return nik.length > 6 ? nik.substring(0, 4) + '*'.repeat(nik.length - 6) + nik.substring(nik.length - 2) : '***';
    };

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-100 selection:text-emerald-700 text-slate-900 dark:text-slate-50">
            <Head>
                <title>Verifikasi Dokumen Resmi - SIPADU Kabupaten Cianjur</title>
                <meta name="description" content="Verifikasi keaslian dokumen resmi yang diterbitkan melalui SIPADU Kabupaten Cianjur. Pastikan dokumen Anda asli dan sah." />
                <meta name="keywords" content="Verifikasi Dokumen, SIPADU, Cianjur, Cek Keaslian Surat, Dokumen Resmi" />
                <meta name="robots" content="index, follow" />
                
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sipadu.cianjurkab.go.id/verifikasi" />
                <meta property="og:title" content="Verifikasi Dokumen Resmi - SIPADU Kabupaten Cianjur" />
                <meta property="og:description" content="Periksa keaslian dokumen resmi yang diterbitkan oleh SIPADU Kabupaten Cianjur." />
                <meta property="og:image" content="https://sipadu.cianjurkab.go.id/logo/sugih-mukti.png" />
            </Head>

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            {/* Navbar */}
            <PublicNavbar subtitle="Verifikasi Dokumen" showAuth={true} />

            <div className="relative z-10 flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-2xl shadow-emerald-100/50 dark:shadow-none backdrop-blur-xl overflow-hidden">
                        {/* Header */}
                        <div className={`p-8 text-center ${isValid ? 'bg-emerald-600' : 'bg-red-600'}`}>
                            <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                                {isValid ? (
                                    <ShieldCheck className="h-9 w-9 text-white" />
                                ) : (
                                    <XCircle className="h-9 w-9 text-white" />
                                )}
                            </div>
                            <h1 className="text-2xl font-extrabold text-white mb-1">
                                {isValid ? 'Dokumen Valid & Resmi' : 'Status Dokumen Belum Valid'}
                            </h1>
                            <p className="text-white/80 text-sm font-medium">SIPADU Kabupaten Cianjur</p>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8 space-y-5">
                            {!isValid && (
                                <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 p-4 text-sm font-medium text-center border border-red-200 dark:border-red-900/50">
                                    Dokumen ini tercatat dalam sistem, namun statusnya masih "{permohonan.status}". Dokumen belum bisa dinyatakan sah.
                                </div>
                            )}

                            <div className="space-y-4">
                                <InfoRow icon={<FileText className="h-5 w-5" />} label="Jenis Surat">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Surat Keterangan {jenis}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">#{permohonan.token}</p>
                                </InfoRow>

                                <InfoRow icon={<User className="h-5 w-5" />} label="Atas Nama">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{maskName(permohonan.user.name)}</p>
                                </InfoRow>

                                {permohonan.user.detailUser?.nik && (
                                    <InfoRow icon={<ShieldCheck className="h-5 w-5" />} label="NIK">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white font-mono tracking-wider">{maskNik(permohonan.user.detailUser.nik)}</p>
                                    </InfoRow>
                                )}

                                <InfoRow icon={<MapPin className="h-5 w-5" />} label="Kelurahan / Kecamatan">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Desa {permohonan.desa.nama_desa}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kecamatan {permohonan.kecamatan.nama_kecamatan}</p>
                                </InfoRow>

                                <InfoRow icon={<Calendar className="h-5 w-5" />} label="Tanggal Pengajuan" last>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {new Date(permohonan.created_at).toLocaleDateString('id-ID', {
                                            weekday: 'long', 
                                            day: 'numeric', 
                                            month: 'long', 
                                            year: 'numeric'
                                        })}
                                    </p>
                                </InfoRow>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950 p-5 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Dokumen ini diterbitkan oleh Kecamatan {permohonan.kecamatan.nama_kecamatan} dan ditandatangani secara elektronik.
                            </p>
                        </div>
                    </div>
            
                    <div className="text-center mt-8">
                        <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors">
                            &larr; Kembali ke Beranda SIPADU
                        </a>
                    </div>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
}

function InfoRow({ icon, label, children, last }: { icon: React.ReactNode, label: string, children: React.ReactNode, last?: boolean }) {
    return (
        <div className={`flex items-start gap-4 ${!last ? 'pb-4 border-b border-slate-100 dark:border-slate-800' : ''}`}>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-500 mt-0.5">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>
                {children}
            </div>
        </div>
    );
}
