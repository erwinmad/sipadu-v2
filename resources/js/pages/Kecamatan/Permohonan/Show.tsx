import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft, FileText, User, MapPin, CheckCircle2, XCircle, Clock, Download, Shield, Hash, Home, Mail, Heart, Building2, DollarSign, History } from 'lucide-react';
import { FormEventHandler } from 'react';

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
    };
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

const FIELD_CONFIGS: Record<string, { label: string; icon?: any; fields: Record<string, string> }> = {
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

export default function Show({ permohonan, jenis, activities }: PageProps) {
    const { data, setData, post, processing, errors } = useForm({
        status: permohonan.status,
        tanggapan: permohonan.tanggapan || '',
        file_hasil: null as File | null,
        _method: 'POST',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/kecamatan/permohonan/${jenis.toLowerCase()}/${permohonan.token}`, {
            forceFormData: true,
        });
    };

    const getStatusConfig = (status: string) => {
        const configs = {
            pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock },
            proses: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-700 border-blue-300', icon: FileText },
            selesai: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
            ditolak: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', badge: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
        };
        return configs[status as keyof typeof configs] || configs.pending;
    };

    const statusConfig = getStatusConfig(permohonan.status);
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

    return (
        <AppLayout>
            <Head title={`Detail Permohonan - ${jenisConfig.label}`} />

            <div className="min-h-screen bg-slate-50 p-6">
                <div className="mb-6 flex items-center gap-4">
                    <button onClick={() => router.visit('/kecamatan/permohonan')} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white shadow-sm transition-all hover:border-emerald-500">
                        <ArrowLeft className="h-5 w-5 text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{jenisConfig.label}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Hash className="h-3 w-3 text-slate-500" />
                            <span className="font-mono text-sm font-bold text-emerald-600">{permohonan.token}</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Status */}
                        <div className={`rounded-lg border ${statusConfig.border} ${statusConfig.bg} p-6`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${statusConfig.badge} border`}>
                                        <StatusIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold uppercase text-slate-600">Status</div>
                                        <div className={`text-xl font-bold uppercase ${statusConfig.text}`}>{permohonan.status}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-600">Diajukan</div>
                                    <div className="text-sm font-bold text-slate-900">
                                        {new Date(permohonan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pemohon & Lokasi */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <User className="h-4 w-4 text-emerald-600" />
                                    <h3 className="text-sm font-bold uppercase text-slate-900">Pemohon</h3>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <div className="text-xs font-bold text-slate-500">Nama</div>
                                        <div className="text-sm font-bold text-slate-900">{permohonan.user.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-500">Email</div>
                                        <div className="flex items-center gap-1 text-sm text-slate-700">
                                            <Mail className="h-3 w-3" />
                                            {permohonan.user.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <MapPin className="h-4 w-4 text-blue-600" />
                                    <h3 className="text-sm font-bold uppercase text-slate-900">Lokasi</h3>
                                </div>
                                <div className="space-y-2">
                                    <div>
                                        <div className="text-xs font-bold text-slate-500">Kecamatan</div>
                                        <div className="text-sm font-bold text-slate-900">{permohonan.kecamatan.nama_kecamatan}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-500">Desa</div>
                                        <div className="text-sm font-bold text-slate-900">{permohonan.desa.nama_desa}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detail */}
                        {getDetailFields().length > 0 && (
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <JenisIcon className="h-4 w-4 text-purple-600" />
                                    <h3 className="text-sm font-bold uppercase text-slate-900">Detail {jenisConfig.label}</h3>
                                </div>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {getDetailFields().map((field, idx) => (
                                        <div key={idx} className="rounded bg-slate-50 p-3 border border-slate-200">
                                            <div className="text-xs font-bold text-slate-500">{field.label}</div>
                                            <div className="mt-1 text-sm font-bold text-slate-900 break-words">{field.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Dokumen */}
                        {getDocumentFields().length > 0 && (
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <Shield className="h-4 w-4 text-amber-600" />
                                    <h3 className="text-sm font-bold uppercase text-slate-900">Dokumen</h3>
                                </div>
                                <div className="grid gap-2 md:grid-cols-2">
                                    {getDocumentFields().map((doc, idx) => (
                                        <a key={idx} href={`/storage/${doc.value}`} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 p-3 transition hover:border-emerald-400">
                                            <span className="text-xs font-bold text-emerald-900">{doc.label}</span>
                                            <Download className="h-4 w-4 text-emerald-600" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        {activities && activities.length > 0 && (
                            <div className="rounded-lg border border-slate-200 bg-white p-4">
                                <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <History className="h-4 w-4 text-indigo-600" />
                                    <h3 className="text-sm font-bold uppercase text-slate-900">Riwayat</h3>
                                </div>
                                <div className="space-y-2">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="flex gap-3 border-l-4 border-emerald-500 bg-slate-50 p-3 rounded-r">
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-slate-900">{activity.description}</div>
                                                {activity.causer && (
                                                    <div className="mt-1 text-xs font-medium text-slate-600">👤 {activity.causer.name}</div>
                                                )}
                                                <div className="mt-1 text-xs text-slate-500">
                                                    🕒 {new Date(activity.created_at).toLocaleString('id-ID', {
                                                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Form */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-5">
                            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <h2 className="text-lg font-bold text-slate-900">Tindak Lanjut</h2>
                            </div>
                            
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase text-slate-700">Status</label>
                                    <select value={data.status} onChange={(e) => setData('status', e.target.value)}
                                        className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20">
                                        <option value="pending">⏳ Pending</option>
                                        <option value="proses">📋 Proses</option>
                                        <option value="selesai">✅ Selesai</option>
                                        <option value="ditolak">❌ Ditolak</option>
                                    </select>
                                    {errors.status && <p className="mt-1 text-xs font-bold text-red-600">{errors.status}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase text-slate-700">Tanggapan</label>
                                    <textarea value={data.tanggapan} onChange={(e) => setData('tanggapan', e.target.value)} rows={4}
                                        placeholder="Berikan tanggapan..."
                                        className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
                                    {errors.tanggapan && <p className="mt-1 text-xs font-bold text-red-600">{errors.tanggapan}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase text-slate-700">File Hasil</label>
                                    {permohonan.file_hasil && (
                                        <div className="mb-3 rounded border border-emerald-300 bg-emerald-50 p-3">
                                            <a href={`/storage/${permohonan.file_hasil}`} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-900">
                                                <span>📄 File Tersedia</span>
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </div>
                                    )}
                                    <input type="file" accept=".pdf" onChange={(e) => setData('file_hasil', e.target.files?.[0] || null)}
                                        className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-emerald-600 file:px-3 file:py-1 file:text-xs file:font-bold file:text-white hover:file:bg-emerald-700" />
                                    <p className="mt-2 text-xs text-slate-500">📎 PDF, Max: 5MB</p>
                                    {errors.file_hasil && <p className="mt-1 text-xs font-bold text-red-600">{errors.file_hasil}</p>}
                                </div>

                                <button type="submit" disabled={processing}
                                    className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-bold uppercase text-white shadow transition hover:bg-emerald-700 disabled:opacity-50">
                                    {processing ? '⏳ Menyimpan...' : '💾 Simpan'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
