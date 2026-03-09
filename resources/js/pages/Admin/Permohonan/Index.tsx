import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { FileText, Clock, CheckCircle2, XCircle, Search, BarChart3, TrendingUp } from 'lucide-react';
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
    } | null;
    desa: {
        nama_desa: string;
    } | null;
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
    filters: { search?: string; status?: string; jenis?: string };
}

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'text-amber-700 bg-amber-50 ring-amber-600/20', icon: Clock },
    proses: { label: 'Proses', color: 'text-blue-700 bg-blue-50 ring-blue-600/20', icon: FileText },
    selesai: { label: 'Selesai', color: 'text-emerald-700 bg-emerald-50 ring-emerald-600/20', icon: CheckCircle2 },
    ditolak: { label: 'Ditolak', color: 'text-red-700 bg-red-50 ring-red-600/20', icon: XCircle },
} as const;

export default function Index({ permohonan, stats, filters }: PageProps) {
    const [filter, setFilter] = useState(filters.status || 'all');
    const [search, setSearch] = useState(filters.search || '');

    const filteredData = permohonan.filter(item => {
        const matchFilter = filter === 'all' || item.status === filter;
        const matchSearch = search === '' ||
            item.token.toLowerCase().includes(search.toLowerCase()) ||
            item.user.name.toLowerCase().includes(search.toLowerCase()) ||
            item.jenis.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const completionRate = stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0;

    const filterButtons = [
        { key: 'all', label: 'Semua', count: stats.total },
        { key: 'pending', label: 'Pending', count: stats.pending },
        { key: 'proses', label: 'Proses', count: stats.proses },
        { key: 'selesai', label: 'Selesai', count: stats.selesai },
        { key: 'ditolak', label: 'Ditolak', count: stats.ditolak },
    ];

    return (
        <AppLayout>
            <Head title="Semua Permohonan" />

            <div className="p-4 lg:p-6 space-y-4">
                {/* Header compact */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Semua Permohonan</h1>
                        <p className="text-xs text-slate-500">Daftar seluruh permohonan layanan dari semua kecamatan</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 ring-1 ring-emerald-600/20">
                            <TrendingUp className="h-3 w-3 text-emerald-600" />
                            <span className="font-semibold text-emerald-700">{completionRate}% selesai</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1.5 ring-1 ring-slate-200">
                            <BarChart3 className="h-3 w-3 text-slate-500" />
                            <span className="font-semibold text-slate-600">{stats.total} total</span>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                        { label: 'Pending', value: stats.pending, color: 'border-l-amber-500 bg-amber-50/50' },
                        { label: 'Proses', value: stats.proses, color: 'border-l-blue-500 bg-blue-50/50' },
                        { label: 'Selesai', value: stats.selesai, color: 'border-l-emerald-500 bg-emerald-50/50' },
                        { label: 'Ditolak', value: stats.ditolak, color: 'border-l-red-500 bg-red-50/50' },
                    ].map((stat) => (
                        <div key={stat.label} className={`border-l-[3px] rounded-r-md px-3 py-2 ${stat.color}`}>
                            <div className="text-xl font-bold text-slate-900 leading-none">{stat.value}</div>
                            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mt-0.5">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter tabs + Search */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-1 overflow-x-auto">
                        {filterButtons.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                                    filter === f.key
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {f.label}
                                <span className={`rounded px-1 py-px text-[10px] ${filter === f.key ? 'bg-white/20' : 'bg-slate-200/80'}`}>
                                    {f.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari token, nama, jenis..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20 sm:w-56"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/80">
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Token</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Jenis</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pemohon</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Kecamatan</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Tanggal</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-12 text-center">
                                            <div className="text-slate-400">
                                                <FileText className="mx-auto h-8 w-8 mb-2 opacity-40" />
                                                <p className="text-xs font-medium">Tidak ada data permohonan</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item) => {
                                        const statusCfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
                                        const StatusIcon = statusCfg?.icon || Clock;
                                        return (
                                            <tr key={`${item.jenis}-${item.id}`} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-3 py-2.5">
                                                    <span className="font-mono text-xs font-bold text-slate-800">{item.token}</span>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">
                                                        {item.jenis}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <div className="text-xs font-medium text-slate-900 leading-tight">{item.user.name}</div>
                                                    <div className="text-[11px] text-slate-400">{item.user.email}</div>
                                                </td>
                                                <td className="px-3 py-2.5 hidden md:table-cell">
                                                    <span className="text-xs text-slate-600">{item.kecamatan?.nama_kecamatan || '-'}</span>
                                                </td>
                                                <td className="px-3 py-2.5 hidden lg:table-cell">
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusCfg?.color}`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusCfg?.label || item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
