import { Head } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, FileText, AlertCircle, Sparkles, Building2, Calendar, FileBadge, Eye, Download, XCircle, MapPin, User, BadgeCheck } from 'lucide-react';
import PublicNavbar from '@/components/public-navbar';
import PublicFooter from '@/components/public-footer';

interface Permohonan {
    id: number;
    token: string;
    status: 'pending' | 'proses' | 'selesai' | 'ditolak';
    created_at: string;
    updated_at: string;
    tanggapan?: string;
    file_hasil?: string;
    user?: {
        name: string;
        email: string;
    };
    kecamatan?: {
        nama_kecamatan: string;
    };
}

interface PageProps {
    permohonan: Permohonan;
    jenis: string;
}

const statusConfig = {
    pending: { label: 'Menunggu', color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 ring-amber-600/20', icon: Clock, info: 'Permohonan Anda sedang menunggu untuk diproses oleh admin.' },
    proses: { label: 'Diproses', color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 ring-blue-600/20', icon: FileText, info: 'Permohonan Anda sedang dalam proses verifikasi dan pembuatan dokumen.' },
    selesai: { label: 'Selesai', color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-600/20', icon: CheckCircle2, info: 'Permohonan Anda telah selesai diproses.' },
    ditolak: { label: 'Ditolak', color: 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 ring-red-600/20', icon: XCircle, info: 'Permohonan Anda ditolak. Silakan periksa tanggapan admin.' },
};

export default function TrackingShow({ permohonan, jenis }: PageProps) {
    const status = statusConfig[permohonan.status];
    const StatusIcon = status.icon;

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const formatShortDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <>
            <Head>
                <title>{`Tracking ${permohonan.token} - SIPADU Kabupaten Cianjur`}</title>
                <meta name="description" content={`Detail status permohonan ${permohonan.token} di SIPADU Kabupaten Cianjur. Lihat progres dan riwayat permohonan dokumen Anda.`} />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-100 selection:text-emerald-700 text-slate-900 dark:text-slate-50">
                {/* Background */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
                </div>

                {/* Navbar */}
                <PublicNavbar
                    showAuth={true}
                    rightContent={
                        <>
                            <a href="/tracking" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
                                <ArrowLeft className="h-4 w-4" />
                                Lacak Lagi
                            </a>
                            <a href="/" className="rounded-xl bg-slate-900 dark:bg-slate-800 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 dark:hover:bg-slate-700">
                                Beranda
                            </a>
                        </>
                    }
                />

                {/* Main */}
                <main className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl space-y-5">

                        {/* Header Card */}
                        <div className="rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-2xl shadow-emerald-100/50 dark:shadow-none backdrop-blur-xl sm:p-8">
                            <div className="flex items-start justify-between gap-4 mb-5">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
                                        <BadgeCheck className="h-3.5 w-3.5" />
                                        Detail Permohonan
                                    </div>
                                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{jenis}</h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detail permohonan Anda</p>
                                </div>
                                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold ring-1 ring-inset ${status.color}`}>
                                    <StatusIcon className="h-4 w-4" />
                                    {status.label}
                                </span>
                            </div>
                            <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-5 py-4">
                                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Token Permohonan</div>
                                <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white tracking-[0.2em] mt-1">{permohonan.token}</div>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-2xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-lg shadow-emerald-100/20 dark:shadow-none backdrop-blur-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-500">
                                        <User className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pemohon</span>
                                </div>
                                <div className="text-base font-bold text-slate-900 dark:text-white">{permohonan.user?.name}</div>
                                <div className="text-sm text-slate-400 mt-0.5 truncate">{permohonan.user?.email}</div>
                            </div>

                            <div className="rounded-2xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-lg shadow-emerald-100/20 dark:shadow-none backdrop-blur-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500">
                                        <MapPin className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kecamatan</span>
                                </div>
                                <div className="text-base font-bold text-slate-900 dark:text-white">{permohonan.kecamatan?.nama_kecamatan || 'N/A'}</div>
                            </div>

                            <div className="rounded-2xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-lg shadow-emerald-100/20 dark:shadow-none backdrop-blur-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500">
                                        <Calendar className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Diajukan</span>
                                </div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{formatShortDate(permohonan.created_at)}</div>
                            </div>

                            <div className="rounded-2xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-lg shadow-emerald-100/20 dark:shadow-none backdrop-blur-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-500">
                                        <Clock className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Diperbarui</span>
                                </div>
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{formatShortDate(permohonan.updated_at)}</div>
                            </div>
                        </div>

                        {/* Tanggapan */}
                        {permohonan.tanggapan && (
                            <div className="rounded-2xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-lg shadow-emerald-100/20 dark:shadow-none backdrop-blur-xl">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Tanggapan Admin</h3>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{permohonan.tanggapan}</p>
                            </div>
                        )}

                        {/* Download Result */}
                        {permohonan.file_hasil && permohonan.status === 'selesai' && (
                            <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-400">Dokumen Siap Diunduh</h3>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">Permohonan Anda telah selesai diproses</p>
                                    </div>
                                    <a
                                        href={`/storage/${permohonan.file_hasil}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:-translate-y-0.5 shadow-xl shadow-emerald-600/20"
                                    >
                                        <Download className="h-4 w-4" />
                                        Unduh
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Status info */}
                        <div className={`rounded-2xl border px-5 py-4 ${
                            permohonan.status === 'pending' ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20' :
                            permohonan.status === 'proses' ? 'border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20' :
                            permohonan.status === 'selesai' ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20' :
                            'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20'
                        }`}>
                            <p className={`text-sm ${
                                permohonan.status === 'pending' ? 'text-amber-800 dark:text-amber-300' :
                                permohonan.status === 'proses' ? 'text-blue-800 dark:text-blue-300' :
                                permohonan.status === 'selesai' ? 'text-emerald-800 dark:text-emerald-300' :
                                'text-red-800 dark:text-red-300'
                            }`}>
                                <strong>Info:</strong> {status.info}
                            </p>
                        </div>
                    </div>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
