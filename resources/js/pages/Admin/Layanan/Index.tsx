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

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Manajemen Layanan</h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola daftar layanan, aktifkan atau nonaktifkan layanan publik.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                     <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 md:max-w-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Cari layanan..."
                                className="w-full pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </form>
                    <Button onClick={openCreateModal}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Layanan
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {layanans.data.map((layanan) => (
                        <Card key={layanan.id} className="flex flex-col">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-semibold">
                                    {layanan.nama_layanan}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={layanan.is_active}
                                        onCheckedChange={(checked) => toggleStatus(layanan, checked)}
                                    />
                                    <span className={`text-xs ${layanan.is_active ? 'text-green-600' : 'text-muted-foreground'}`}>
                                        {layanan.is_active ? 'Aktif' : 'Non-Aktif'}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col gap-4">
                                <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                                    {layanan.deskripsi || 'Tidak ada deskripsi.'}
                                </p>
                                
                                {!layanan.is_active && layanan.informasi_status && (
                                     <div className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                                        <strong>Info Non-Aktif:</strong> {layanan.informasi_status}
                                     </div>
                                )}

                                <div className="flex items-center justify-between border-t pt-4 mt-auto">
                                    <div className="text-xs text-muted-foreground font-mono">
                                        Slug: {layanan.slug}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditModal(layanan)}
                                        >
                                            <Edit2 className="mr-2 h-3.5 w-3.5" /> Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => confirmDelete(layanan.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {layanans.data.length === 0 && (
                        <div className="col-span-full py-10 text-center text-muted-foreground">
                            <FileText className="mx-auto h-10 w-10 opacity-20" />
                            <p className="mt-2">Tidak ada layanan ditemukan.</p>
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
