import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, Plus, Trash2, Users, BarChart3, MapPin, UserCheck, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Import Wayfinder actions for routing
import { index, store, update, destroy as destroyAction } from '@/actions/App/Http/Controllers/Admin/PenggunaController';

interface Role {
    id: number;
    name: string;
    label: string;
}

interface Kecamatan {
    id: string;
    nama_kecamatan: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    roles: Role[];
    kecamatan?: Kecamatan;
}

interface PageProps {
    users: {
        data: User[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        total: number;
        from: number;
        to: number;
    };
    roles: Role[];
    kecamatans: Kecamatan[];
    stats: {
        total: number;
        superadmin: number;
        kecamatan: number;
        pemohon: number;
    };
    userByKecamatan: {
        name: string;
        total: number;
    }[];
    filters: {
        search?: string;
        role?: string;
    };
}

export default function PenggunaIndex({ users, roles, kecamatans, stats, userByKecamatan, filters }: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');

    // Prepare chart data with short names if necessary
    const chartData = userByKecamatan.map(item => ({
        ...item,
        shortName: item.name.length > 10 ? item.name.substring(0, 8) + '...' : item.name
    }));

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(index.url(), { search, role: roleFilter === 'all' ? undefined : roleFilter }, { preserveState: true });
    };

    const handleRoleFilterChange = (value: string) => {
        setRoleFilter(value);
        router.get(index.url(), { search, role: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        kode_kecamatan: '',
    });

    const openCreateModal = () => {
        setIsEditing(false);
        reset();
        clearErrors();
        setIsOpen(true);
    };

    const openEditModal = (user: User) => {
        setIsEditing(true);
        clearErrors();
        const userRole = user.roles.length > 0 ? user.roles[0].name : '';
        setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            role: userRole,
            kode_kecamatan: user.kecamatan?.id || '',
        });
        setEditingUserId(user.id);
        setIsOpen(true);
    };

    const [editingUserId, setEditingUserId] = useState<string | null>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const options = {
            onSuccess: () => {
                setIsOpen(false);
                reset();
                setEditingUserId(null);
            },
            onError: (errors: any) => {
                console.error("Submission failed:", errors);
            }
        };

        if (isEditing && editingUserId) {
            put(update.url(editingUserId), options);
        } else {
            post(store.url(), options);
        }
    };

    const confirmDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(destroyAction.url(id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pengguna', href: '/admin/pengguna' }]}>
            <Head title="Manajemen Pengguna" />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Manajemen Pengguna</h1>
                        <p className="text-sm text-slate-500">Kelola akses, role, dan akun petugas kecamatan maupun admin pusat.</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
                    </Button>
                </div>

                {/* Stats & Distribution Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left side: Stats Cards in 2x2 grid (Span 4) */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                        {[
                            { icon: Users, label: 'Total Pengguna', value: stats.total, color: 'border-l-blue-500 bg-blue-50/50', iconColor: 'text-blue-600' },
                            { icon: ShieldCheck, label: 'Superadmin', value: stats.superadmin, color: 'border-l-purple-500 bg-purple-50/50', iconColor: 'text-purple-600' },
                            { icon: UserCheck, label: 'Petugas Kec.', value: stats.kecamatan, color: 'border-l-emerald-500 bg-emerald-50/50', iconColor: 'text-emerald-600' },
                            { icon: ShieldCheck, label: 'Pemohon/Publik', value: stats.pemohon, color: 'border-l-amber-500 bg-amber-50/50', iconColor: 'text-amber-600' },
                        ].map((stat) => (
                            <div key={stat.label} className={`border-l-[4px] rounded-xl px-4 py-5 shadow-sm border border-slate-100 flex flex-col justify-center ${stat.color}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`p-1.5 rounded-lg bg-white shadow-sm ${stat.iconColor}`}>
                                        <stat.icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</span>
                                </div>
                                <div className="text-2xl font-black text-slate-900 leading-none">{stat.value.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>

                    {/* Right side: Recharts Bar Chart Card (Span 8) */}
                    <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col min-h-[300px]">
                        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 shrink-0">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <MapPin className="h-3 w-3" /> Distribusi Pengguna per Kecamatan
                            </h3>
                        </div>
                        <div className="p-4 flex-1">
                            {chartData.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                                    <BarChart3 className="h-8 w-8 opacity-20 mb-2" />
                                    <p className="text-xs">Belum ada data distribusi</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="shortName" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                                            interval={0}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                                        />
                                        <Tooltip 
                                            cursor={{ fill: '#f8fafc' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div className="bg-white border border-slate-100 shadow-xl rounded-lg p-2.5">
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{payload[0].payload.name}</p>
                                                            <p className="text-sm font-black text-slate-900">{payload[0].value} Pengguna</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={24}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={'#10b981'} fillOpacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 md:max-w-sm">
                        <Input
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 bg-white shadow-sm border-slate-200"
                        />
                    </form>
                    <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                        <SelectTrigger className="h-10 w-[200px] bg-white shadow-sm border-slate-200 font-medium">
                            <SelectValue placeholder="Filter Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Role</SelectItem>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name}>
                                    {role.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Users className="h-3 w-3" /> Daftar Pengguna Terdaftar
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-10 text-center">No</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Nama Pengguna</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Alamat Email</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Akses Role</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Kecamatan</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.data.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3.5 text-center text-slate-400 font-medium">{index + 1}</td>
                                        <td className="px-4 py-3.5">
                                            <div className="font-bold text-slate-900 leading-tight">{user.name}</div>
                                            <div className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">UUID: {user.id.substring(0, 8)}...</div>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600 font-medium shrink-0">{user.email}</td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role) => (
                                                    <span key={role.id} className="inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[11px] font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 whitespace-nowrap">
                                                        {role.label || role.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {user.kecamatan ? (
                                                <span className="inline-flex items-center rounded-md bg-purple-50 px-1.5 py-0.5 text-[11px] font-bold text-purple-700 ring-1 ring-inset ring-purple-700/10 whitespace-nowrap">
                                                    {user.kecamatan.nama_kecamatan}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-xs font-medium">Internal Pusat</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditModal(user)}
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => confirmDelete(user.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-slate-400 bg-white">
                                            <Users className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            <div className="font-medium">Tidak ada data pengguna ditemukan</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination Footer */}
                    <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Menampilkan <span className="text-slate-900">{users.from || 0}</span> sampai <span className="text-slate-900">{users.to || 0}</span> dari <span className="text-slate-900">{users.total}</span> Pengguna
                        </div>
                        <div className="flex flex-wrap justify-center gap-1">
                            {users.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    className={`
                                        h-8 min-w-[32px] px-2 rounded-md text-[10px] font-black uppercase tracking-tighter transition-all
                                        ${link.active 
                                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                                            : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed'
                                        }
                                    `}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
                            <DialogDescription>
                                {isEditing
                                    ? 'Ubah detail pengguna di sini. Klik simpan setelah selesai.'
                                    : 'Isi formulir berikut untuk membuat pengguna baru.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama Lengkap"
                                    required
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@contoh.com"
                                    required
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password {isEditing && '(Opsional)'}</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required={!isEditing}
                                    />
                                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) => setData('role', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.name}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                            </div>

                            {data.role === 'kecamatan' && (
                                <div className="space-y-2">
                                    <Label htmlFor="kode_kecamatan">Kecamatan</Label>
                                    <Select
                                        value={data.kode_kecamatan}
                                        onValueChange={(value) => setData('kode_kecamatan', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kecamatan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kecamatans.map((kec) => (
                                                <SelectItem key={kec.id} value={kec.id}>
                                                    {kec.nama_kecamatan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.kode_kecamatan && (
                                        <p className="text-sm text-destructive">{errors.kode_kecamatan}</p>
                                    )}
                                </div>
                            )}

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
