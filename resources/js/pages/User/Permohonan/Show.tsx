import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, FileText, User, MapPin, CheckCircle2, XCircle, Clock, Download, Shield, Hash, Home, Mail, Heart, Building2, DollarSign, History, Eye, X, MessageSquare, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Permohonan {
    id: number;
    token: string;
    status: string;
    tanggapan: string | null;
    file_hasil: string | null;
    created_at: string;
    updated_at: string;
    user: {
        name: string;
        email: string;
    } | null;
    kecamatan: {
        nama_kecamatan: string;
    };
    desa: {
        nama_desa: string;
    };
    [key: string]: any;
}

interface Activity {
    id: number;
    description: string;
    properties: any;
    created_at: string;
    causer: {
        name: string;
        email: string;
    } | null;
}

interface PageProps {
    permohonan: Permohonan;
    jenis: string;
    activities: Activity[];
}

const FIELD_CONFIGS: Record<string, { label: string; icon: any; fields: Record<string, string> }> = {
    domisili: {
        label: 'Surat Keterangan Domisili',
        icon: Home,
        fields: {
            no_pengantar: 'No. Surat Pengantar',
            tgl_pengantar: 'Tanggal Pengantar',
            alamat_domisili: 'Alamat Domisili',
        }
    },
    sktm: {
        label: 'Surat Keterangan Tidak Mampu',
        icon: DollarSign,
        fields: {
            no_pengantar: 'No. Surat Pengantar',
            tgl_pengantar: 'Tanggal Pengantar',
            tujuan: 'Tujuan/Peruntukan',
            peruntukan: 'Peruntukan',
            penghasilan: 'Penghasilan',
            tanggungan: 'Jumlah Tanggungan',
        }
    },
    nikah: {
        label: 'Surat Keterangan Nikah',
        icon: Heart,
        fields: {
            no_pengantar: 'No. Surat Pengantar',
            tgl_pengantar: 'Tanggal Pengantar',
            calon_mempelai1: 'Calon Mempelai 1',
            bin_mempelai1: 'Bin/Binti Mempelai 1',
            status_mempelai1: 'Status Mempelai 1',
            nama_mempelai2: 'Nama Mempelai 2',
            calon_mempelai2: 'Calon Mempelai 2',
            bin_mempelai2: 'Bin/Binti Mempelai 2',
            tmp_lahir_mempelai2: 'Tempat Lahir Mempelai 2',
            tgl_lahir_mempelai2: 'Tanggal Lahir Mempelai 2',
            agama_mempelai2: 'Agama Mempelai 2',
            wn_mempelai2: 'Kewarganegaraan Mempelai 2',
            pekerjaan_mempelai2: 'Pekerjaan Mempelai 2',
            status_mempelai2: 'Status Mempelai 2',
            alamat_mempelai2: 'Alamat Mempelai 2',
            hari_nikah: 'Hari Pernikahan',
            tgl_nikah: 'Tanggal Pernikahan',
            alamat_nikah: 'Alamat Pernikahan',
            alasan: 'Alasan',
        }
    },
    usaha: {
        label: 'Surat Keterangan Usaha',
        icon: Building2,
        fields: {
            no_pengantar: 'No. Surat Pengantar',
            tgl_pengantar: 'Tanggal Pengantar',
            jenis_usaha: 'Jenis Usaha',
            kegiatan_usaha: 'Kegiatan Usaha',
            nama_perusahaan: 'Nama Perusahaan',
            pemilik_usaha: 'Pemilik Usaha',
            alamat_usaha: 'Alamat Usaha',
        }
    }
};

const DOCUMENT_CONFIGS: Record<string, Record<string, string>> = {
    domisili: {
        ktp: 'KTP',
        kk: 'Kartu Keluarga',
        pengantar: 'Surat Pengantar RT/RW',
    },
    sktm: {
        ktp: 'KTP',
        kk: 'Kartu Keluarga',
        pengantar: 'Surat Pengantar RT/RW',
        pernyataan: 'Surat Pernyataan',
    },
    nikah: {
        ktp_pria: 'KTP Calon Mempelai Pria',
        ktp_wanita: 'KTP Calon Mempelai Wanita',
        bukti_pendaftaran: 'Bukti Pendaftaran Nikah',
    },
    usaha: {
        ktp: 'KTP',
        sku: 'Surat Keterangan Usaha',
    }
};

const STATUS_CONFIG = {
    pending: { label: 'Pending', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', ring: 'ring-amber-600/20', icon: Clock },
    proses: { label: 'Proses', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', ring: 'ring-blue-600/20', icon: FileText },
    selesai: { label: 'Selesai', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', ring: 'ring-emerald-600/20', icon: CheckCircle2 },
    ditolak: { label: 'Ditolak', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', ring: 'ring-red-600/20', icon: XCircle },
} as const;

export default function Show({ permohonan, jenis, activities }: PageProps) {
    const [viewingDoc, setViewingDoc] = useState<{ label: string; url: string } | null>(null);

    const statusConfig = STATUS_CONFIG[permohonan.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
    const StatusIcon = statusConfig.icon;
    const jenisKey = jenis.toLowerCase();
    const jenisConfig = FIELD_CONFIGS[jenisKey] || FIELD_CONFIGS.domisili;
    const JenisIcon = jenisConfig.icon;
    const documentConfig = DOCUMENT_CONFIGS[jenisKey] || {};

    const getDetailFields = () => {
        const fields: { label: string; value: any }[] = [];
        Object.entries(jenisConfig.fields).forEach(([key, label]) => {
            if (permohonan[key]) {
                let value = permohonan[key];
                if (key.includes('tgl_') || key.includes('tanggal')) {
                    value = new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                }
                fields.push({ label, value });
            }
        });
        return fields;
    };

    const getDocumentFields = () => {
        const docs: { label: string; value: any }[] = [];
        Object.entries(documentConfig).forEach(([key, label]) => {
            if (permohonan[key]) {
                docs.push({ label, value: permohonan[key] });
            }
        });
        return docs;
    };

    const handleViewDocument = (label: string, path: string) => {
        setViewingDoc({ label, url: `/storage/${path}` });
    };

    return (
        <AppLayout>
            <Head title={`Detail Permohonan - ${jenisConfig.label}`} />

            <div className="p-4 lg:p-6 space-y-3">
                {/* Top bar */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.visit('/users')}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white transition-colors hover:bg-slate-50"
                    >
                        <ArrowLeft className="h-4 w-4 text-slate-600" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-bold text-slate-900 truncate">{jenisConfig.label}</h1>
                            <span className={`inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusConfig.text} ${statusConfig.bg} ${statusConfig.ring}`}>
                                <StatusIcon className="h-3 w-3" />
                                {permohonan.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Hash className="h-3 w-3 text-slate-400" />
                            <span className="font-mono text-xs font-semibold text-slate-500">{permohonan.token}</span>
                            <span className="text-slate-300 mx-1">·</span>
                            <span className="text-[11px] text-slate-400">
                                {new Date(permohonan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-3">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-3">
                        {/* Summary & Status Message */}
                        {permohonan.tanggapan && (
                            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Tanggapan Admin</span>
                                </div>
                                <p className="text-xs text-slate-700 font-medium leading-relaxed">{permohonan.tanggapan}</p>
                            </div>
                        )}

                        <div className="grid gap-2 sm:grid-cols-2">
                            <div className="rounded-md border border-slate-200 bg-white p-3">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <User className="h-3.5 w-3.5 text-emerald-600" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pemohon</span>
                                </div>
                                <div className="text-sm font-semibold text-slate-900">{permohonan.user?.name || 'N/A'}</div>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Mail className="h-3 w-3 text-slate-400" />
                                    <span className="text-xs text-slate-500">{permohonan.user?.email || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="rounded-md border border-slate-200 bg-white p-3">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Lokasi</span>
                                </div>
                                <div className="text-sm font-semibold text-slate-900">{permohonan.kecamatan.nama_kecamatan}</div>
                                <div className="text-xs text-slate-500 mt-0.5">Desa {permohonan.desa.nama_desa}</div>
                            </div>
                        </div>

                        {/* Detail fields */}
                        {getDetailFields().length > 0 && (
                            <div className="rounded-md border border-slate-200 bg-white p-3">
                                <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-slate-100">
                                    <JenisIcon className="h-3.5 w-3.5 text-purple-600" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Detail {jenis}</span>
                                </div>
                                <div className="grid gap-1.5 sm:grid-cols-2">
                                    {getDetailFields().map((field, idx) => (
                                        <div key={idx} className="flex items-baseline gap-2 rounded px-2 py-1.5 bg-slate-50">
                                            <span className="text-[11px] font-medium text-slate-500 shrink-0 whitespace-nowrap">{field.label}</span>
                                            <span className="text-xs font-semibold text-slate-900 break-words">{field.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Documents */}
                        {getDocumentFields().length > 0 && (
                            <div className="rounded-md border border-slate-200 bg-white p-3">
                                <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
                                    <div className="flex items-center gap-1.5">
                                        <Shield className="h-3.5 w-3.5 text-amber-600" />
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Dokumen Pendukung</span>
                                    </div>
                                    {permohonan.status === 'selesai' && (
                                        <button
                                            onClick={() => {
                                                if (confirm('Apakah Anda yakin ingin menghapus dokumen persyaratan? Aksi ini tidak dapat dibatalkan.')) {
                                                    router.delete(`/users/permohonan/${jenis.toLowerCase()}/${permohonan.token}/dokumen`);
                                                }
                                            }}
                                            className="flex items-center gap-1.5 rounded bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 ring-1 ring-inset ring-red-600/20 transition-colors hover:bg-red-100"
                                            title="Hapus Dokumen Persyaratan untuk menghemat storage"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                            Hapus Dokumen
                                        </button>
                                    )}
                                </div>
                                <div className="grid gap-1.5 sm:grid-cols-2">
                                    {getDocumentFields().map((doc, idx) => (
                                        <div key={idx} className="flex items-center justify-between gap-2 rounded bg-slate-50 px-2.5 py-2">
                                            <span className="text-xs font-medium text-slate-700">{doc.label}</span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleViewDocument(doc.label, doc.value)}
                                                    className="rounded p-1 text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Lihat"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                                <a
                                                    href={`/storage/${doc.value}`}
                                                    download
                                                    className="rounded p-1 text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                    title="Unduh"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column — Timeline & Documents Result */}
                    <div className="lg:col-span-1 space-y-3">
                        <div className="sticky top-4 space-y-3">
                            {/* Download Result */}
                            {permohonan.file_hasil && permohonan.status === 'selesai' && (
                                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center">
                                    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 placeholder-slate-400">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <h3 className="text-xs font-bold text-emerald-900">Permohonan Selesai</h3>
                                    <p className="mt-1 mb-3 text-[10px] text-emerald-700">Dokumen hasil Anda sudah diterbitkan dan dapat diunduh.</p>
                                    <a
                                        href={`/storage/${permohonan.file_hasil}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                                    >
                                        <Download className="h-3.5 w-3.5" />
                                        Unduh Dokumen Hasil
                                    </a>
                                </div>
                            )}

                            {/* Timeline */}
                            {activities && activities.length > 0 && (
                                <div className="rounded-md border border-slate-200 bg-white p-3">
                                    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-100">
                                        <History className="h-3.5 w-3.5 text-indigo-600" />
                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Riwayat Permohonan</span>
                                    </div>
                                    <div className="space-y-1">
                                        {activities.map((activity) => (
                                            <div key={activity.id} className="border-l-2 border-slate-200 pl-2.5 py-1.5 relative">
                                                <div className="absolute -left-[5px] top-2.5 h-2 w-2 rounded-full bg-slate-300"></div>
                                                <div className="text-xs font-semibold text-slate-800 leading-tight">{activity.description}</div>
                                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                                                    {activity.causer && <span>Oleh {activity.causer.name}</span>}
                                                    <span>
                                                        {new Date(activity.created_at).toLocaleString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Viewer Modal */}
            <Dialog open={!!viewingDoc} onOpenChange={() => setViewingDoc(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                    <DialogHeader className="p-4 pb-3 border-b">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-sm font-bold">{viewingDoc?.label}</DialogTitle>
                            <button
                                onClick={() => setViewingDoc(null)}
                                className="rounded p-1.5 hover:bg-slate-100 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </DialogHeader>
                    <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                        {viewingDoc && (
                            viewingDoc.url.endsWith('.pdf') ? (
                                <iframe
                                    src={viewingDoc.url}
                                    className="w-full h-[600px] border-0"
                                    title={viewingDoc.label}
                                />
                            ) : (
                                <img
                                    src={viewingDoc.url}
                                    alt={viewingDoc.label}
                                    className="w-full h-auto rounded"
                                />
                            )
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
