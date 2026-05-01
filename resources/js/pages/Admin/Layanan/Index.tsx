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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit2, FileText, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

// Import Wayfinder actions for Layanan routing
import { index, store, update, destroy as destroyAction } from '@/actions/App/Http/Controllers/Admin/LayananController';

interface Layanan {
    id: number;
    nama_layanan: string;
    slug: string;
    deskripsi: string;
    is_active: boolean;
    informasi_status: string | null;
}

interface PageProps {
    layanans: {
        data: Layanan[];
        links: any[];
    };
    filters: {
        search?: string;
    };
}

export default function LayananIndex({ layanans, filters }: PageProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [editingLayananId, setEditingLayananId] = useState<number | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        nama_layanan: '',
        slug: '',
        deskripsi: '',
        is_active: true,
        informasi_status: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(index.url(), { search }, { preserveState: true });
    };

    const openCreateModal = () => {
        setIsEditing(false);
        reset();
        clearErrors();
        setEditingLayananId(null);
        setIsOpen(true);
    };

    const openEditModal = (layanan: Layanan) => {
        setIsEditing(true);
        clearErrors();
        setEditingLayananId(layanan.id);
        setData({
            nama_layanan: layanan.nama_layanan,
            slug: layanan.slug,
            deskripsi: layanan.deskripsi || '',
            is_active: layanan.is_active,
            informasi_status: layanan.informasi_status || '',
        });
        setIsOpen(true);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && editingLayananId) {
            put(update.url(editingLayananId), {
                onSuccess: () => setIsOpen(false),
            });
        } else {
            post(store.url(), {
                onSuccess: () => setIsOpen(false),
            });
        }
    };

    const confirmDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
            router.delete(destroyAction.url(id), {
                preserveScroll: true,
            });
        }
    };

    const toggleStatus = (layanan: Layanan, checked: boolean) => {
        router.put(update.url(layanan.id), {
            nama_layanan: layanan.nama_layanan,
            slug: layanan.slug,
            deskripsi: layanan.deskripsi,
            informasi_status: layanan.informasi_status,
            is_active: checked,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Success
            },
            onError: (errors) => {
                console.error("Failed to update status:", errors);
                alert("Gagal mengupdate status. Periksa inputan atau log.");
            }
        });
    };

    // Auto-generate slug from nama_layanan
    const handleNamaLayananChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData((prev) => ({
            ...prev,
            nama_layanan: value,
            slug: isEditing ? prev.slug : value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        }));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Layanan', href: '/admin/layanan' }]}>
            <Head title="Manajemen Layanan" />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Manajemen Layanan Publik</h1>
                        <p className="text-sm text-slate-500">Kelola ketersediaan, deskripsi, dan status operasional setiap jenis layanan.</p>
                    </div>
                    <Button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20">
                        <Plus className="mr-2 h-4 w-4" /> Tambah Layanan Baru
                    </Button>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 md:max-w-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Cari nama layanan atau deskripsi..."
                                className="w-full pl-9 h-10 bg-white border-slate-200 shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                {/* Grid of Service Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {layanans.data.map((layanan) => {
                        const isActive = layanan.is_active;
                        return (
                            <div key={layanan.id} className={`group relative flex flex-col rounded-xl border transition-all duration-300 ${isActive ? 'bg-white border-slate-200 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-500/5' : 'bg-slate-50/50 border-slate-200 opacity-80'}`}>
                                <div className="p-5 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${isActive ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={layanan.is_active}
                                                onCheckedChange={(checked) => toggleStatus(layanan, checked)}
                                                className="data-[state=checked]:bg-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <h3 className={`text-base font-bold mb-1.5 transition-colors ${isActive ? 'text-slate-900 group-hover:text-emerald-700' : 'text-slate-500'}`}>
                                        {layanan.nama_layanan}
                                    </h3>
                                    
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                                        {layanan.deskripsi || 'Layanan administrasi resmi untuk masyarakat.'}
                                    </p>

                                    {!isActive && layanan.informasi_status && (
                                        <div className="mb-4 rounded-lg bg-red-50/50 border border-red-100 p-2.5">
                                            <p className="text-[10px] leading-tight text-red-700">
                                                <span className="font-bold uppercase tracking-wider block mb-1">Status Maintenance:</span>
                                                {layanan.informasi_status}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1.5 pt-4 border-t border-slate-100">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isActive ? 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/20' : 'bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-500/20'}`}>
                                            {isActive ? 'Operasional' : 'Non-Aktif'}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-400 ml-auto truncate opacity-60">/{layanan.slug}</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 bg-slate-50/30 px-4 py-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditModal(layanan)}
                                        className="h-8 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                        <Edit2 className="mr-1.5 h-3 w-3" /> Sunting
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => confirmDelete(layanan.id)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                    {layanans.data.length === 0 && (
                        <div className="col-span-full py-20 text-center rounded-2xl border-2 border-dashed border-slate-200">
                            <FileText className="mx-auto h-12 w-12 text-slate-200 mb-2" />
                            <h3 className="text-sm font-bold text-slate-900">Belum ada layanan</h3>
                            <p className="text-xs text-slate-500">Mulai dengan menambahkan jenis layanan baru.</p>
                        </div>
                    )}
                </div>

                {/* Dialog Form */}
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? 'Edit Layanan' : 'Tambah Layanan Baru'}</DialogTitle>
                            <DialogDescription>
                                {isEditing
                                    ? 'Ubah detail layanan dan status ketersediaannya.'
                                    : 'Tambahkan jenis layanan baru ke dalam sistem.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama_layanan">Nama Layanan</Label>
                                <Input
                                    id="nama_layanan"
                                    value={data.nama_layanan}
                                    onChange={handleNamaLayananChange}
                                    placeholder="Contoh: Surat Domisili"
                                    required
                                />
                                {errors.nama_layanan && <p className="text-sm text-destructive">{errors.nama_layanan}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="contoh-surat-domisili"
                                    className="font-mono text-sm"
                                    required
                                />
                                {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    placeholder="Jelaskan fungsi layanan ini..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="informasi_status">Informasi Status (Jika Non-Aktif)</Label>
                                <Textarea
                                    id="informasi_status"
                                    value={data.informasi_status}
                                    onChange={(e) => setData('informasi_status', e.target.value)}
                                    placeholder="Contoh: Sedang dalam pemeliharaan sistem atau kuota penuh."
                                    rows={2}
                                />
                                {errors.informasi_status && <p className="text-sm text-destructive">{errors.informasi_status}</p>}
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
