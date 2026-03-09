import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, XCircle, User, MapPin, Phone, CreditCard, Image, Camera, Calendar, Briefcase, GraduationCap, ShieldCheck, ShieldX, Clock } from 'lucide-react';
import { useState } from 'react';

interface DetailUser {
    id: number;
    nik: string;
    no_telepon: string;
    alamat: string;
    tempat_lahir: string | null;
    tanggal_lahir: string | null;
    jenis_kelamin: string | null;
    pendidikan_terakhir: string;
    pekerjaan: string | null;
    foto_ktp: string | null;
    foto_verifikasi: string | null;
    verification_status: 'pending' | 'verified' | 'rejected';
    verification_note: string | null;
    verified_at: string | null;
    created_at: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
    kecamatan: {
        nama_kecamatan: string;
    };
    desa: {
        nama_desa: string;
    };
    verified_by_user: {
        name: string;
    } | null;
}

interface PageProps {
    detailUser: DetailUser;
}

const STATUS_CONFIG = {
    pending: { label: 'Menunggu Verifikasi', color: 'bg-amber-50 text-amber-700 ring-amber-600/20', icon: Clock },
    verified: { label: 'Terverifikasi', color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', icon: ShieldCheck },
    rejected: { label: 'Ditolak', color: 'bg-red-50 text-red-700 ring-red-600/20', icon: ShieldX },
} as const;

export default function Show({ detailUser }: PageProps) {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const { data, setData, post, processing } = useForm({
        action: '' as string,
        verification_note: '',
    });

    const handleVerify = () => {
        if (!confirm('Apakah Anda yakin data pengguna ini sudah benar dan ingin memverifikasi?')) return;
        setData({ action: 'verified', verification_note: '' });
        post(`/kecamatan/verifikasi-user/${detailUser.id}`);
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        setData('action', 'rejected');
        post(`/kecamatan/verifikasi-user/${detailUser.id}`);
    };

    const statusCfg = STATUS_CONFIG[detailUser.verification_status];
    const StatusIcon = statusCfg.icon;

    return (
        <AppLayout>
            <Head title={`Verifikasi - ${detailUser.user.name}`} />

            <div className="p-4 lg:p-6 space-y-4">
                {/* Back + Header */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.visit('/kecamatan/verifikasi-user')}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-lg font-bold text-slate-900">Detail Pengguna</h1>
                        <p className="text-xs text-slate-500">Verifikasi kecocokan data KTP dengan foto live</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusCfg.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusCfg.label}
                    </span>
                </div>

                {/* Verification info banner (if already verified/rejected) */}
                {detailUser.verification_status !== 'pending' && (
                    <div className={`rounded-lg border p-3 ${detailUser.verification_status === 'verified' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="flex items-start gap-2">
                            {detailUser.verification_status === 'verified' 
                                ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" /> 
                                : <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />}
                            <div className="text-xs">
                                <p className={`font-semibold ${detailUser.verification_status === 'verified' ? 'text-emerald-800' : 'text-red-800'}`}>
                                    {detailUser.verification_status === 'verified' ? 'Profil telah diverifikasi' : 'Profil ditolak'}
                                </p>
                                {detailUser.verified_by_user && (
                                    <p className="text-slate-600 mt-0.5">
                                        Oleh: {detailUser.verified_by_user.name} • {detailUser.verified_at && new Date(detailUser.verified_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                )}
                                {detailUser.verification_note && (
                                    <p className="mt-1 text-slate-600 italic">"{detailUser.verification_note}"</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Photo Comparison — Side by Side */}
                <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                            <Camera className="h-3.5 w-3.5" />
                            Perbandingan Dokumen & Foto Live
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                        {/* KTP */}
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <CreditCard className="h-4 w-4 text-blue-600" />
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Foto KTP</span>
                            </div>
                            {detailUser.foto_ktp ? (
                                <div className="relative group">
                                    <img
                                        src={`/storage/${detailUser.foto_ktp}`}
                                        alt="Foto KTP"
                                        className="w-full rounded-lg border border-slate-200 object-contain max-h-[400px] bg-slate-50"
                                    />
                                    <a
                                        href={`/storage/${detailUser.foto_ktp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 rounded-lg transition-colors"
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 bg-white/90 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 shadow transition-opacity">
                                            Buka di tab baru
                                        </span>
                                    </a>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-slate-400">
                                    <Image className="h-8 w-8 mb-2 opacity-50" />
                                    <span className="text-xs">Belum ada foto KTP</span>
                                </div>
                            )}
                        </div>

                        {/* Foto Live */}
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Camera className="h-4 w-4 text-purple-600" />
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Foto Verifikasi (Live)</span>
                            </div>
                            {detailUser.foto_verifikasi ? (
                                <div className="relative group">
                                    <img
                                        src={`/storage/${detailUser.foto_verifikasi}`}
                                        alt="Foto Verifikasi"
                                        className="w-full rounded-lg border border-slate-200 object-contain max-h-[400px] bg-slate-50"
                                    />
                                    <a
                                        href={`/storage/${detailUser.foto_verifikasi}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 rounded-lg transition-colors"
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 bg-white/90 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-700 shadow transition-opacity">
                                            Buka di tab baru
                                        </span>
                                    </a>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-slate-400">
                                    <Camera className="h-8 w-8 mb-2 opacity-50" />
                                    <span className="text-xs">Belum ada foto verifikasi</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Data */}
                <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                            <User className="h-3.5 w-3.5" />
                            Data Pengguna
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100">
                        {[
                            { icon: User, label: 'Nama Lengkap', value: detailUser.user.name },
                            { icon: CreditCard, label: 'NIK', value: detailUser.nik, mono: true },
                            { icon: Phone, label: 'No. Telepon', value: detailUser.no_telepon },
                            { icon: MapPin, label: 'Kecamatan', value: detailUser.kecamatan?.nama_kecamatan || '-' },
                            { icon: MapPin, label: 'Desa', value: detailUser.desa?.nama_desa || '-' },
                            { icon: MapPin, label: 'Alamat', value: detailUser.alamat },
                            { icon: Calendar, label: 'Tempat, Tgl Lahir', value: `${detailUser.tempat_lahir || '-'}, ${detailUser.tanggal_lahir ? new Date(detailUser.tanggal_lahir).toLocaleDateString('id-ID') : '-'}` },
                            { icon: User, label: 'Jenis Kelamin', value: detailUser.jenis_kelamin === 'L' ? 'Laki-laki' : detailUser.jenis_kelamin === 'P' ? 'Perempuan' : '-' },
                            { icon: GraduationCap, label: 'Pendidikan', value: detailUser.pendidikan_terakhir },
                            { icon: Briefcase, label: 'Pekerjaan', value: detailUser.pekerjaan || '-' },
                        ].map((field, i) => (
                            <div key={i} className="bg-white px-4 py-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <field.icon className="h-3 w-3 text-slate-400" />
                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{field.label}</span>
                                </div>
                                <span className={`text-sm font-medium text-slate-900 ${field.mono ? 'font-mono' : ''}`}>
                                    {field.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                {detailUser.verification_status === 'pending' && (
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Aksi Verifikasi</h3>

                        {!showRejectForm ? (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleVerify}
                                    disabled={processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    Verifikasi & Setujui
                                </button>
                                <button
                                    onClick={() => setShowRejectForm(true)}
                                    disabled={processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-red-600 ring-1 ring-red-200 transition-all hover:bg-red-50 hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Tolak
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleReject} className="space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                                        Alasan Penolakan <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.verification_note}
                                        onChange={(e) => setData('verification_note', e.target.value)}
                                        rows={3}
                                        required
                                        placeholder="Contoh: Foto KTP tidak jelas, NIK tidak sesuai dengan foto KTP, dll."
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-red-400 focus:ring-1 focus:ring-red-400/20 placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={processing || !data.verification_note.trim()}
                                        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Konfirmasi Tolak
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRejectForm(false)}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
