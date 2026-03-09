import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Users, Settings, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/kecamatan',
    },
];

const quickLinks = [
    {
        title: 'Permohonan',
        description: 'Kelola permohonan layanan masyarakat',
        icon: FileText,
        href: '/kecamatan/permohonan',
        color: 'text-emerald-600 bg-emerald-50',
    },
    {
        title: 'Pejabat',
        description: 'Data pejabat penandatangan',
        icon: Users,
        href: '/kecamatan/pejabat',
        color: 'text-blue-600 bg-blue-50',
    },
    {
        title: 'Profil',
        description: 'Informasi dan atribut surat',
        icon: Settings,
        href: '/kecamatan/profile',
        color: 'text-purple-600 bg-purple-50',
    },
];

interface DashboardProps {
    stats: { name: string; value: number; color: string }[];
    monthlyData: any[];
    totalPermohonan: number;
}

export default function Dashboard({ stats, monthlyData, totalPermohonan }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kecamatan Dashboard" />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Header Section */}
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Kecamatan</h1>
                    <p className="text-sm text-slate-500">Selamat datang, kelola administrasi surat pengantar dengan mudah.</p>
                </div>

                {/* Quick links & Summary Count */}
                <div className="grid gap-3 sm:grid-cols-4">
                    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-4">
                        <div className="h-10 w-10 flex-shrink-0 bg-slate-900 rounded-full flex justify-center items-center text-white">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Permohonan</div>
                            <div className="text-2xl font-black text-slate-900">{totalPermohonan}</div>
                        </div>
                    </div>
                    {quickLinks.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className="group flex flex-col justify-center gap-2 rounded-lg border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded ${link.color}`}>
                                    <link.icon className="h-4 w-4" />
                                </div>
                                <div className="text-sm font-bold text-slate-900">{link.title}</div>
                                <ArrowRight className="h-4 w-4 text-slate-300 ml-auto group-hover:text-slate-600 transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Charts Area */}
                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Donut Chart */}
                    <div className="lg:col-span-1 rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex flex-col">
                        <h2 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Permohonan Berdasarkan Jenis</h2>
                        <div className="flex-1 min-h-[250px] relative">
                            {totalPermohonan > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {stats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value: any) => [`${value} Surat`, 'Total']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs text-slate-400">Belum ada data</div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }}></span>
                                    {stat.name}: <span className="text-slate-900">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex flex-col">
                        <h2 className="text-sm font-bold text-slate-900 mb-4 tracking-tight">Tren Permohonan (6 Bulan Terakhir)</h2>
                        <div className="flex-1 min-h-[250px]">
                            {monthlyData && monthlyData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                        <RechartsTooltip 
                                            cursor={{fill: '#f1f5f9'}}
                                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                                        <Bar dataKey="Domisili" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                                        <Bar dataKey="SKTM" stackId="a" fill="#3b82f6" />
                                        <Bar dataKey="Nikah" stackId="a" fill="#f59e0b" />
                                        <Bar dataKey="Usaha" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full items-center justify-center text-xs text-slate-400">Belum ada data</div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
