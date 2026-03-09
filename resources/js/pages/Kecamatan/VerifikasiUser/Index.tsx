import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { UserCheck, Clock, CheckCircle2, XCircle, Eye, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface DetailUser {
    id: number;
    nik: string;
    no_telepon: string;
    verification_status: 'pending' | 'verified' | 'rejected';
    verified_at: string | null;
    foto_ktp: string | null;
    foto_verifikasi: string | null;
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
    verified: number;
    rejected: number;
}

interface PaginatedData {
    data: DetailUser[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface PageProps {
    users: PaginatedData;
    stats: Stats;
    filters: { search?: string; status?: string };
}

const STATUS_CONFIG = {
    pending: { label: 'Menunggu', color: 'text-amber-700 bg-amber-50 ring-amber-600/20', icon: Clock },
    verified: { label: 'Terverifikasi', color: 'text-emerald-700 bg-emerald-50 ring-emerald-600/20', icon: CheckCircle2 },
    rejected: { label: 'Ditolak', color: 'text-red-700 bg-red-50 ring-red-600/20', icon: XCircle },
} as const;

export default function Index({ users, stats, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const handleFilter = (status: string) => {
        setStatusFilter(status);
        router.get('/kecamatan/verifikasi-user', {
            ...(search && { search }),
            ...(status !== 'all' && { status }),
        }, { preserveState: true, replace: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/kecamatan/verifikasi-user', {
            ...(search && { search }),
            ...(statusFilter !== 'all' && { status: statusFilter }),
        }, { preserveState: true, replace: true });
    };

    const filterButtons = [
        { key: 'all', label: 'Semua', count: stats.total },
        { key: 'pending', label: 'Menunggu', count: stats.pending },
        { key: 'verified', label: 'Terverifikasi', count: stats.verified },
        { key: 'rejected', label: 'Ditolak', count: stats.rejected },
    ];

    return (
        <AppLayout>
            <Head title="Verifikasi Pengguna" />

            <div className="p-4 lg:p-6 space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Verifikasi Pengguna</h1>
                        <p className="text-xs text-slate-500">Verifikasi data KTP dan foto live pengguna sebelum memproses permohonan</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 ring-1 ring-amber-600/20">
                            <Clock className="h-3 w-3 text-amber-600" />
                            <span className="font-semibold text-amber-700">{stats.pending} menunggu</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 ring-1 ring-emerald-600/20">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                            <span className="font-semibold text-emerald-700">{stats.verified} terverifikasi</span>
                        </div>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { label: 'Menunggu', value: stats.pending, color: 'border-l-amber-500 bg-amber-50/50' },
                        { label: 'Terverifikasi', value: stats.verified, color: 'border-l-emerald-500 bg-emerald-50/50' },
                        { label: 'Ditolak', value: stats.rejected, color: 'border-l-red-500 bg-red-50/50' },
                    ].map((stat) => (
                        <div key={stat.label} className={`border-l-[3px] rounded-r-md px-3 py-2 ${stat.color}`}>
                            <div className="text-xl font-bold text-slate-900 leading-none">{stat.value}</div>
                            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mt-0.5">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter + Search */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-1 overflow-x-auto">
                        {filterButtons.map(f => (
                            <button
                                key={f.key}
                                onClick={() => handleFilter(f.key)}
                                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                                    statusFilter === f.key
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {f.label}
                                <span className={`rounded px-1 py-px text-[10px] ${statusFilter === f.key ? 'bg-white/20' : 'bg-slate-200/80'}`}>
                                    {f.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari NIK, nama, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-md border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20 sm:w-56"
                        />
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/80">
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pengguna</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">NIK</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Desa</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Dokumen</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                    <th className="px-3 py-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-3 py-12 text-center">
                                            <div className="text-slate-400">
                                                <UserCheck className="mx-auto h-8 w-8 mb-2 opacity-40" />
                                                <p className="text-xs font-medium">Tidak ada data pengguna</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((item) => {
                                        const statusCfg = STATUS_CONFIG[item.verification_status];
                                        const StatusIcon = statusCfg?.icon || Clock;
                                        return (
                                            <tr
                                                key={item.id}
                                                onClick={() => router.visit(`/kecamatan/verifikasi-user/${item.id}`)}
                                                className="cursor-pointer transition-colors hover:bg-slate-50"
                                            >
                                                <td className="px-3 py-2.5">
                                                    <div className="text-xs font-medium text-slate-900 leading-tight">{item.user.name}</div>
                                                    <div className="text-[11px] text-slate-400">{item.user.email}</div>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <span className="font-mono text-xs text-slate-700">{item.nik}</span>
                                                </td>
                                                <td className="px-3 py-2.5 hidden md:table-cell">
                                                    <span className="text-xs text-slate-600">{item.desa?.nama_desa || '-'}</span>
                                                </td>
                                                <td className="px-3 py-2.5 hidden lg:table-cell">
                                                    <div className="flex gap-1">
                                                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${item.foto_ktp ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                                            KTP {item.foto_ktp ? '✓' : '✗'}
                                                        </span>
                                                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${item.foto_verifikasi ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                                            Foto {item.foto_verifikasi ? '✓' : '✗'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${statusCfg?.color}`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {statusCfg?.label}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                                                        <Eye className="h-3.5 w-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2">
                            <span className="text-[11px] text-slate-500">
                                Menampilkan {users.data.length} dari {users.total} data
                            </span>
                            <div className="flex gap-1">
                                {users.links.map((link, i) => (
                                    <button
                                        key={i}
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                                            link.active
                                                ? 'bg-slate-900 text-white'
                                                : link.url
                                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
