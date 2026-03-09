import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Users, FileText, Clock, CheckCircle2, XCircle, TrendingUp, MapPin, UserCheck, BarChart3 } from 'lucide-react';

interface Stats {
    totalUsers: number;
    totalKecamatan: number;
    totalPermohonan: number;
    statusStats: { pending: number; proses: number; selesai: number; ditolak: number };
    verificationStats: { pending: number; verified: number; rejected: number };
}

interface PermohonanByType {
    name: string;
    value: number;
    color: string;
}

interface MonthlyData {
    name: string;
    Domisili: number;
    SKTM: number;
    Nikah: number;
    Usaha: number;
}

interface RecentPermohonan {
    id: number;
    token: string;
    jenis: string;
    status: string;
    created_at: string;
    user: { name: string; email: string };
    kecamatan: { nama_kecamatan: string } | null;
    desa: { nama_desa: string } | null;
}

interface RecentUser {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    verification_status: string;
    kecamatan: string;
    desa: string;
    nik: string;
}

interface PermohonanByKecamatan {
    name: string;
    total: number;
}

interface PageProps {
    stats: Stats;
    permohonanByType: PermohonanByType[];
    monthlyData: MonthlyData[];
    recentPermohonan: RecentPermohonan[];
    recentUsers: RecentUser[];
    permohonanByKecamatan: PermohonanByKecamatan[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pending', color: 'text-amber-700 bg-amber-50 ring-amber-600/20' },
    proses: { label: 'Proses', color: 'text-blue-700 bg-blue-50 ring-blue-600/20' },
    selesai: { label: 'Selesai', color: 'text-emerald-700 bg-emerald-50 ring-emerald-600/20' },
    ditolak: { label: 'Ditolak', color: 'text-red-700 bg-red-50 ring-red-600/20' },
};

const VERIF_CONFIG: Record<string, { label: string; color: string }> = {
    pending: { label: 'Menunggu', color: 'text-amber-700 bg-amber-50 ring-amber-600/20' },
    verified: { label: 'Terverifikasi', color: 'text-emerald-700 bg-emerald-50 ring-emerald-600/20' },
    rejected: { label: 'Ditolak', color: 'text-red-700 bg-red-50 ring-red-600/20' },
    'belum lengkap': { label: 'Belum Lengkap', color: 'text-slate-500 bg-slate-100 ring-slate-300/20' },
};

export default function Dashboard({ stats, permohonanByType, monthlyData, recentPermohonan, recentUsers, permohonanByKecamatan }: PageProps) {
    const completionRate = stats.totalPermohonan > 0 ? Math.round((stats.statusStats.selesai / stats.totalPermohonan) * 100) : 0;
    const maxKecamatan = Math.max(...permohonanByKecamatan.map(k => k.total), 1);

    return (
        <AppLayout>
            <Head title="Dashboard Admin" />

            <div className="p-4 lg:p-6 space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Dashboard Superadmin</h1>
                        <p className="text-xs text-slate-500">Ringkasan data seluruh layanan SIPADU Kabupaten Cianjur</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 ring-1 ring-emerald-600/20">
                            <TrendingUp className="h-3 w-3 text-emerald-600" />
                            <span className="font-semibold text-emerald-700">{completionRate}% selesai</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1.5 ring-1 ring-slate-200">
                            <BarChart3 className="h-3 w-3 text-slate-500" />
                            <span className="font-semibold text-slate-600">{stats.totalPermohonan} total</span>
                        </div>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                    {[
                        { icon: Users, label: 'Pengguna', value: stats.totalUsers, color: 'border-l-blue-500 bg-blue-50/50' },
                        { icon: MapPin, label: 'Kecamatan', value: stats.totalKecamatan, color: 'border-l-purple-500 bg-purple-50/50' },
                        { icon: FileText, label: 'Permohonan', value: stats.totalPermohonan, color: 'border-l-emerald-500 bg-emerald-50/50' },
                        { icon: Clock, label: 'Pending', value: stats.statusStats.pending, color: 'border-l-amber-500 bg-amber-50/50' },
                        { icon: CheckCircle2, label: 'Selesai', value: stats.statusStats.selesai, color: 'border-l-green-500 bg-green-50/50' },
                        { icon: XCircle, label: 'Ditolak', value: stats.statusStats.ditolak, color: 'border-l-red-500 bg-red-50/50' },
                    ].map((stat) => (
                        <div key={stat.label} className={`border-l-[3px] rounded-r-md px-3 py-2 ${stat.color}`}>
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <stat.icon className="h-3 w-3 text-slate-400" />
                                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{stat.label}</span>
                            </div>
                            <div className="text-xl font-bold text-slate-900 leading-none">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Row: Type + Monthly + Verification */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Per Jenis */}
                    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <BarChart3 className="h-3 w-3" /> Per Jenis Layanan
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {permohonanByType.map((item) => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${stats.totalPermohonan > 0 ? (item.value / stats.totalPermohonan) * 100 : 0}%`, backgroundColor: item.color }} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-900 w-8 text-right">{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tren Bulanan */}
                    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <TrendingUp className="h-3 w-3" /> Tren 6 Bulan Terakhir
                            </h3>
                        </div>
                        <div className="p-4">
                            <div className="flex items-end gap-1 h-32">
                                {monthlyData.map((m, i) => {
                                    const total = m.Domisili + m.SKTM + m.Nikah + m.Usaha;
                                    const maxTotal = Math.max(...monthlyData.map(md => md.Domisili + md.SKTM + md.Nikah + md.Usaha), 1);
                                    const height = (total / maxTotal) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-[10px] font-bold text-slate-700">{total}</span>
                                            <div className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-500" style={{ height: `${Math.max(height, 4)}%` }} />
                                            <span className="text-[9px] text-slate-400 font-medium">{m.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Verifikasi Pengguna */}
                    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <UserCheck className="h-3 w-3" /> Verifikasi Pengguna
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="rounded-lg bg-amber-50 p-2.5">
                                    <div className="text-xl font-bold text-amber-700">{stats.verificationStats.pending}</div>
                                    <div className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">Menunggu</div>
                                </div>
                                <div className="rounded-lg bg-emerald-50 p-2.5">
                                    <div className="text-xl font-bold text-emerald-700">{stats.verificationStats.verified}</div>
                                    <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Verified</div>
                                </div>
                                <div className="rounded-lg bg-red-50 p-2.5">
                                    <div className="text-xl font-bold text-red-700">{stats.verificationStats.rejected}</div>
                                    <div className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">Ditolak</div>
                                </div>
                            </div>
                            {(() => {
                                const total = stats.verificationStats.pending + stats.verificationStats.verified + stats.verificationStats.rejected;
                                if (total === 0) return <p className="text-xs text-slate-400 text-center">Belum ada data</p>;
                                return (
                                    <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
                                        <div className="bg-emerald-500 transition-all" style={{ width: `${(stats.verificationStats.verified / total) * 100}%` }} />
                                        <div className="bg-amber-400 transition-all" style={{ width: `${(stats.verificationStats.pending / total) * 100}%` }} />
                                        <div className="bg-red-400 transition-all" style={{ width: `${(stats.verificationStats.rejected / total) * 100}%` }} />
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Per Kecamatan */}
                <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" /> Top 10 Permohonan per Kecamatan
                        </h3>
                    </div>
                    <div className="p-4 space-y-2">
                        {permohonanByKecamatan.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-4">Belum ada data</p>
                        ) : permohonanByKecamatan.map((kec, i) => (
                            <div key={kec.name} className="flex items-center gap-3">
                                <span className="w-5 text-right text-[10px] font-bold text-slate-400">{i + 1}</span>
                                <span className="w-28 text-xs font-medium text-slate-700 truncate capitalize">{kec.name.toLowerCase()}</span>
                                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500" style={{ width: `${(kec.total / maxKecamatan) * 100}%` }} />
                                </div>
                                <span className="text-xs font-bold text-slate-800 w-8 text-right">{kec.total}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Two column: Recent Permohonan + Recent Users */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Recent Permohonan */}
                    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 flex items-center justify-between">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <FileText className="h-3 w-3" /> Permohonan Terbaru
                            </h3>
                            <span className="text-[10px] text-slate-400">10 terakhir</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/80">
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Token</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Jenis</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pemohon</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentPermohonan.length === 0 ? (
                                        <tr><td colSpan={5} className="px-3 py-8 text-center text-xs text-slate-400">Belum ada permohonan</td></tr>
                                    ) : recentPermohonan.map((item) => {
                                        const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                                        return (
                                            <tr key={`${item.jenis}-${item.id}`} className="hover:bg-slate-50">
                                                <td className="px-3 py-2.5">
                                                    <span className="font-mono text-xs font-bold text-slate-800">{item.token}</span>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">{item.jenis}</span>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <div className="text-xs font-medium text-slate-900 leading-tight">{item.user?.name}</div>
                                                    <div className="text-[11px] text-slate-400">{item.kecamatan?.nama_kecamatan || '-'}</div>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${cfg.color}`}>{cfg.label}</span>
                                                </td>
                                                <td className="px-3 py-2.5 hidden md:table-cell">
                                                    <span className="text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Users */}
                    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5 flex items-center justify-between">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <Users className="h-3 w-3" /> Pengguna Terbaru
                            </h3>
                            <span className="text-[10px] text-slate-400">10 terakhir</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/80">
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pengguna</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Domisili</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Verifikasi</th>
                                        <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Terdaftar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentUsers.length === 0 ? (
                                        <tr><td colSpan={4} className="px-3 py-8 text-center text-xs text-slate-400">Belum ada pengguna</td></tr>
                                    ) : recentUsers.map((user) => {
                                        const cfg = VERIF_CONFIG[user.verification_status] || VERIF_CONFIG['belum lengkap'];
                                        return (
                                            <tr key={user.id} className="hover:bg-slate-50">
                                                <td className="px-3 py-2.5">
                                                    <div className="text-xs font-medium text-slate-900 leading-tight">{user.name}</div>
                                                    <div className="text-[11px] text-slate-400">{user.email}</div>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <div className="text-xs text-slate-600">{user.kecamatan}</div>
                                                    <div className="text-[11px] text-slate-400">{user.desa}</div>
                                                </td>
                                                <td className="px-3 py-2.5">
                                                    <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${cfg.color}`}>{cfg.label}</span>
                                                </td>
                                                <td className="px-3 py-2.5 hidden md:table-cell">
                                                    <span className="text-xs text-slate-500">{new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Distribusi Status Permohonan</h3>
                    </div>
                    <div className="p-4">
                        <div className="flex h-4 rounded-full overflow-hidden bg-slate-100">
                            {stats.totalPermohonan > 0 && (
                                <>
                                    <div className="bg-amber-400 transition-all" style={{ width: `${(stats.statusStats.pending / stats.totalPermohonan) * 100}%` }} />
                                    <div className="bg-blue-400 transition-all" style={{ width: `${(stats.statusStats.proses / stats.totalPermohonan) * 100}%` }} />
                                    <div className="bg-emerald-500 transition-all" style={{ width: `${(stats.statusStats.selesai / stats.totalPermohonan) * 100}%` }} />
                                    <div className="bg-red-400 transition-all" style={{ width: `${(stats.statusStats.ditolak / stats.totalPermohonan) * 100}%` }} />
                                </>
                            )}
                        </div>
                        <div className="flex justify-between mt-3">
                            {[
                                { label: 'Pending', count: stats.statusStats.pending, color: 'bg-amber-400' },
                                { label: 'Proses', count: stats.statusStats.proses, color: 'bg-blue-400' },
                                { label: 'Selesai', count: stats.statusStats.selesai, color: 'bg-emerald-500' },
                                { label: 'Ditolak', count: stats.statusStats.ditolak, color: 'bg-red-400' },
                            ].map(s => (
                                <div key={s.label} className="flex items-center gap-1.5">
                                    <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                                    <span className="text-[11px] text-slate-500">{s.label}</span>
                                    <span className="text-[11px] font-bold text-slate-700">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
