import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Clock, CheckCircle2, XCircle, Download, Search, ExternalLink, Inbox, User } from 'lucide-react';

interface Permohonan {
    id: number;
    token: string;
    jenis: string;
    status: string;
    created_at: string;
    updated_at: string;
    tanggapan: string | null;
    file_hasil: string | null;
    kecamatan: {
        nama_kecamatan: string;
    };
    desa: {
        nama_desa: string;
    };
}

interface Stats {
    total: number;
    pending: number;
    proses: number;
    selesai: number;
    ditolak: number;
}

interface PageProps {
    permohonan: Permohonan[];
    stats: Stats;
}

const STATUS_CONFIG = {
    pending: { label: 'Menunggu', color: 'text-amber-700 bg-amber-50 ring-amber-600/20', icon: Clock },
    proses: { label: 'Diproses', color: 'text-blue-700 bg-blue-50 ring-blue-600/20', icon: FileText },
    selesai: { label: 'Selesai', color: 'text-emerald-700 bg-emerald-50 ring-emerald-600/20', icon: CheckCircle2 },
    ditolak: { label: 'Ditolak', color: 'text-red-700 bg-red-50 ring-red-600/20', icon: XCircle },
} as const;

const breadcrumbs = [
    { title: 'Dashboard', href: '/users' },
];

export default function Dashboard({ permohonan, stats }: PageProps) {
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Saya" />

            <div className="p-4 lg:p-6 space-y-4">
                {/* Header */}
                <div>
                    <h1 className="text-lg font-bold text-slate-900">Dashboard Saya</h1>
                    <p className="text-xs text-slate-500">Pantau status permohonan layanan Anda</p>
                </div>

                {/* Quick Access */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    <Link href="/users/pengguna" className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors group shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 mb-2 group-hover:scale-110 transition-transform">
                            <User className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 text-center">Edit Profil</span>
                    </Link>
                    <Link href="/layanan/domisili" className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100 hover:border-emerald-200 transition-colors group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 text-center">Permohonan Domisili</span>
                    </Link>
                    <Link href="/layanan/sktm" className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-200 transition-colors group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 text-center">Permohonan SKTM</span>
                    </Link>
                    <Link href="/layanan/nikah" className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100 hover:border-purple-200 transition-colors group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 text-center">Permohonan Nikah</span>
                    </Link>
                    <Link href="/layanan/usaha" className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border border-amber-100 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-200 transition-colors group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-2 group-hover:scale-110 transition-transform">
                            <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 text-center">Permohonan Usaha</span>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                        { label: 'Menunggu', value: stats.pending, color: 'border-l-amber-500 bg-amber-50/50' },
                        { label: 'Diproses', value: stats.proses, color: 'border-l-blue-500 bg-blue-50/50' },
                        { label: 'Selesai', value: stats.selesai, color: 'border-l-emerald-500 bg-emerald-50/50' },
                        { label: 'Ditolak', value: stats.ditolak, color: 'border-l-red-500 bg-red-50/50' },
                    ].map((stat) => (
                        <div key={stat.label} className={`border-l-[3px] rounded-r-md px-3 py-2 ${stat.color}`}>
                            <div className="text-xl font-bold text-slate-900 leading-none">{stat.value}</div>
                            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mt-0.5">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Permohonan List */}
                {permohonan.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-12 text-center">
                        <Inbox className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Belum Ada Permohonan</h3>
                        <p className="text-xs text-slate-500 mb-4">Anda belum mengajukan permohonan layanan apapun</p>
                        <a href="/#layanan" className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Ajukan Permohonan
                        </a>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {permohonan.map((item) => {
                            const statusCfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                            const StatusIcon = statusCfg.icon;

                            return (
                                <div
                                    key={`${item.jenis}-${item.id}`}
                                    className="rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700">
                                                    {item.jenis}
                                                </span>
                                                <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${statusCfg.color}`}>
                                                    <StatusIcon className="h-2.5 w-2.5" />
                                                    {statusCfg.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-xs font-bold text-slate-800">{item.token}</span>
                                                <span className="text-slate-300">·</span>
                                                <span className="text-[11px] text-slate-500">{formatDate(item.created_at)}</span>
                                            </div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">
                                                {item.kecamatan?.nama_kecamatan} · Desa {item.desa?.nama_desa}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            {item.file_hasil && item.status === 'selesai' && (
                                                <a
                                                    href={`/storage/${item.file_hasil}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 transition-colors hover:bg-emerald-100"
                                                    title="Unduh Dokumen Hasil"
                                                >
                                                    <Download className="h-3 w-3" />
                                                    Unduh
                                                </a>
                                            )}
                                            <Link
                                                href={`/users/permohonan/${item.jenis.toLowerCase()}/${item.token}`}
                                                className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200 transition-colors hover:bg-slate-50"
                                                title="Lihat Detail & Riwayat"
                                            >
                                                <Search className="h-3 w-3" />
                                                Detail
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Tanggapan */}
                                    {item.tanggapan && (
                                        <div className="mt-2 rounded bg-slate-50 px-2.5 py-2 border-l-2 border-slate-300">
                                            <p className="text-[11px] text-slate-600 leading-relaxed">
                                                <span className="font-semibold text-slate-700">Tanggapan:</span> {item.tanggapan}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
