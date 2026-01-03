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
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
        links: any[];
    };
    roles: Role[];
    kecamatans: Kecamatan[];
    filters: {
        search?: string;
        role?: string;
    };
}

export default function PenggunaIndex({ users, roles, kecamatans, filters }: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');
    
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
        // We probably need to store the editing ID somewhere but useForm helper doesn't persist it.
        // We handle the submit differently.
        // Actually, let's keep track of editing user id in a state
        // and create separate submit handlers or use a wrapper.
        // For simplicity, let's just use a ref or state for the ID.
        // But cleaner is to use a separate state `editingUserId`.
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

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-1 items-center gap-2">
                         <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 md:max-w-sm">
                            <Input
                                placeholder="Cari nama atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-9"
                            />
                        </form>
                        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                            <SelectTrigger className="h-9 w-[180px]">
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
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Pengguna
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pengguna</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="p-4 font-medium">Nama</th>
                                        <th className="p-4 font-medium">Email</th>
                                        <th className="p-4 font-medium">Role</th>
                                        <th className="p-4 font-medium">Kecamatan</th>
                                        <th className="p-4 font-medium text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">{user.name}</td>
                                            <td className="p-4">{user.email}</td>
                                            <td className="p-4">
                                                {user.roles.map((role) => (
                                                    <Badge key={role.id} variant="secondary" className="mr-1">
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                            </td>
                                            <td className="p-4">{user.kecamatan?.nama_kecamatan || '-'}</td>
                                            <td className="p-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openEditModal(user)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => confirmDelete(user.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                Tidak ada data pengguna.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

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
