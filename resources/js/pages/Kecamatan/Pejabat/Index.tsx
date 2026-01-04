import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, UserCheck, UserX, FileSignature } from 'lucide-react';

interface Pejabat {
    id: number;
    nama_pejabat: string;
    nip: string;
    jabatan: string;
    jenis_pejabat: string;
    is_active: boolean;
    ttd_digital: string | null;
    stempel: string | null;
}

interface PageProps {
    pejabat: Pejabat[];
}

export default function Index({ pejabat }: PageProps) {
    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pejabat ini?')) {
            router.delete(route('kecamatan.pejabat.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Daftar Pejabat" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Daftar Pejabat
                        </h2>
                        <p className="text-muted-foreground">
                            Kelola pejabat penandatangan dokumen (Camat, Sekcam, Kasi).
                        </p>
                    </div>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                        <Link href={route('kecamatan.pejabat.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Pejabat
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama & NIP</TableHead>
                                <TableHead>Jabatan</TableHead>
                                <TableHead>Tanda Tangan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pejabat.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        Belum ada data pejabat. Silakan tambah data baru.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pejabat.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>
                                            <div className="font-medium">{p.nama_pejabat}</div>
                                            <div className="text-xs text-muted-foreground">NIP. {p.nip}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{p.jabatan}</div>
                                            <div className="text-xs capitalize text-muted-foreground">{p.jenis_pejabat}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {p.ttd_digital ? (
                                                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                        <FileSignature className="mr-1 h-3 w-3" /> TTD Ada
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                                        TTD Kosong
                                                    </span>
                                                )}
                                                {p.stempel && (
                                                    <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                                        Stempel Ada
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {p.is_active ? (
                                                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                                    Non-Aktif
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={route('kecamatan.pejabat.edit', p.id)}>
                                                        <Pencil className="h-4 w-4 text-orange-500" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
