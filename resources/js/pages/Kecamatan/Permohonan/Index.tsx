import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { FileText, Clock, CheckCircle2, XCircle, Eye, Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface Permohonan {
    id: number;
    token: string;
    jenis: string;
    status: string;
    created_at: string;
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

export default function Index({ permohonan, stats }: PageProps) {
    const [filter, setFilter] = useState<string>('all');
    const [search, setSearch] = useState<string>('');

    const filteredData = permohonan.filter(item => {
        const matchFilter = filter === 'all' || item.status === filter;
        const matchSearch = search === '' || 
            item.token.toLowerCase().includes(search.toLowerCase()) ||
            item.user.name.toLowerCase().includes(search.toLowerCase()) ||
            item.jenis.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-amber-100 text-amber-700 border-amber-200',
            proses: 'bg-blue-100 text-blue-700 border-blue-200',
            selesai: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            ditolak: 'bg-red-100 text-red-700 border-red-200',
        };
        const icons = {
            pending: Clock,
            proses: FileText,
            selesai: CheckCircle2,
            ditolak: XCircle,
        };
        const Icon = icons[status as keyof typeof icons];
        
        return (
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase ${styles[status as keyof typeof styles]}`}>
                <Icon className="h-3 w-3" />
                {status}
            </span>
        );
    };

    const handleView = (jenis: string, token: string) => {
        router.visit(`/kecamatan/permohonan/${jenis.toLowerCase()}/${token}`);
    };

    return (
        <AppLayout>
            <Head title="Manajemen Permohonan" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-black text-slate-900">Manajemen Permohonan</h1>
                    <p className="text-sm font-medium text-slate-600">Kelola semua permohonan layanan dari masyarakat</p>
                </div>

                {/* Stats Cards */}
                <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="text-2xl font-black text-slate-900">{stats.total}</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</div>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                        <div className="text-2xl font-black text-amber-700">{stats.pending}</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending</div>
                    </div>
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
                        <div className="text-2xl font-black text-blue-700">{stats.proses}</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Proses</div>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                        <div className="text-2xl font-black text-emerald-700">{stats.selesai}</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">Selesai</div>
                    </div>
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
                        <div className="text-2xl font-black text-red-700">{stats.ditolak}</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-red-600">Ditolak</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${filter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('proses')}
                            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${filter === 'proses' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            Proses
                        </button>
                        <button
                            onClick={() => setFilter('selesai')}
                            className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${filter === 'selesai' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                            Selesai
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari token, nama, jenis..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:w-64"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Token</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Jenis</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Pemohon</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Desa</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700">Status</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-700">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                                            Tidak ada data permohonan
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => (
                                        <tr key={`${item.jenis}-${item.id}`} className="transition-colors hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-sm font-bold text-emerald-600">{item.token}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-sm font-bold text-slate-900">{item.jenis}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-slate-900">{item.user.name}</div>
                                                <div className="text-xs text-slate-500">{item.user.email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-700">{item.desa.nama_desa}</td>
                                            <td className="px-4 py-3 text-sm text-slate-700">
                                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleView(item.jenis, item.token)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
