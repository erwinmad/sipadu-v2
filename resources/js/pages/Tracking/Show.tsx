import { Head } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, XCircle, FileText, Calendar, MapPin, User } from 'lucide-react';

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
    pending: {
        label: 'Menunggu',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock,
    },
    proses: {
        label: 'Diproses',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: FileText,
    },
    selesai: {
        label: 'Selesai',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle2,
    },
    ditolak: {
        label: 'Ditolak',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
    },
};

export default function TrackingShow({ permohonan, jenis }: PageProps) {
    const status = statusConfig[permohonan.status];
    const StatusIcon = status.icon;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title={`Tracking ${permohonan.token} - SIPADU`} />
            
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
                                <a href="/tracking" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 transition-colors hover:text-emerald-700">
                                    <ArrowLeft className="h-3 w-3" />
                                    Lacak Lagi
                                </a>
                                <a href="/" className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800">
                                    BERANDA
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="relative z-10 pt-24 pb-12 lg:pt-28 lg:pb-16">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="mx-auto max-w-3xl">
                            {/* Header Card */}
                            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                                <div className="mb-4 flex items-start justify-between">
                                    <div>
                                        <h1 className="mb-1 text-2xl font-black text-slate-900">{jenis}</h1>
                                        <p className="text-sm text-slate-600">Detail dan status permohonan Anda</p>
                                    </div>
                                    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 ${status.color}`}>
                                        <StatusIcon className="h-4 w-4" />
                                        <span className="text-sm font-bold">{status.label}</span>
                                    </div>
                                </div>

                                {/* Token Display */}
                                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Token Permohonan</div>
                                    <div className="text-2xl font-mono font-black text-slate-900 tracking-wider">{permohonan.token}</div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="mb-6 grid gap-4 md:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-white p-5">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <User className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900">Pemohon</h3>
                                    </div>
                                    <p className="text-base font-bold text-slate-900">{permohonan.user?.name}</p>
                                    <p className="text-xs text-slate-500">{permohonan.user?.email}</p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-5">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <MapPin className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900">Kecamatan</h3>
                                    </div>
                                    <p className="text-base font-bold text-slate-900">{permohonan.kecamatan?.nama_kecamatan || 'N/A'}</p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-5">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                            <Calendar className="h-4 w-4 text-amber-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900">Tanggal Pengajuan</h3>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">{formatDate(permohonan.created_at)}</p>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-white p-5">
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center">
                                            <Clock className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900">Terakhir Diperbarui</h3>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">{formatDate(permohonan.updated_at)}</p>
                                </div>
                            </div>

                            {/* Tanggapan */}
                            {permohonan.tanggapan && (
                                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
                                    <h3 className="mb-3 text-sm font-bold text-slate-900">Tanggapan Admin</h3>
                                    <p className="text-sm text-slate-700 leading-relaxed">{permohonan.tanggapan}</p>
                                </div>
                            )}

                            {/* Download Result */}
                            {permohonan.file_hasil && permohonan.status === 'selesai' && (
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="mb-1 text-sm font-bold text-emerald-900">Dokumen Hasil Siap Diunduh</h3>
                                            <p className="text-xs text-emerald-700">Permohonan Anda telah selesai diproses</p>
                                        </div>
                                        <a
                                            href={`/storage/${permohonan.file_hasil}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
                                        >
                                            <FileText className="h-4 w-4" />
                                            Unduh Dokumen
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Status Info */}
                            {permohonan.status === 'pending' && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                    <p className="text-xs text-amber-800">
                                        <strong>Informasi:</strong> Permohonan Anda sedang menunggu untuk diproses oleh admin. Harap bersabar.
                                    </p>
                                </div>
                            )}

                            {permohonan.status === 'proses' && (
                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                    <p className="text-xs text-blue-800">
                                        <strong>Informasi:</strong> Permohonan Anda sedang dalam proses verifikasi dan pembuatan dokumen.
                                    </p>
                                </div>
                            )}

                            {permohonan.status === 'ditolak' && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                                    <p className="text-xs text-red-800">
                                        <strong>Informasi:</strong> Permohonan Anda ditolak. Silakan periksa tanggapan admin di atas untuk informasi lebih lanjut.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
