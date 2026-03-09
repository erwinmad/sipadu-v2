import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, FileSignature, Users } from 'lucide-react';

declare var route: any;

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

    const activeCount = pejabat.filter(p => p.is_active).length;

    return (
        <AppLayout>
            <Head title="Daftar Pejabat" />

            <div className="p-4 lg:p-6 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Daftar Pejabat</h1>
                        <p className="text-xs text-slate-500">
                            Penandatangan dokumen · <span className="font-semibold text-emerald-600">{activeCount} aktif</span> dari {pejabat.length}
                        </p>
                    </div>
                    <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 text-xs h-8">
                        <Link href={route('kecamatan.pejabat.create')}>
                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                            Tambah
                        </Link>
                    </Button>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/80">
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pejabat</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Jabatan</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Kelengkapan</th>
                                    <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                    <th className="px-3 py-2 w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pejabat.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-3 py-12 text-center">
                                            <div className="text-slate-400">
                                                <Users className="mx-auto h-8 w-8 mb-2 opacity-40" />
                                                <p className="text-xs font-medium">Belum ada data pejabat</p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">Silakan tambah data baru</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    pejabat.map((p) => (
                                        <tr key={p.id} className="transition-colors hover:bg-slate-50">
                                            <td className="px-3 py-2.5">
                                                <div className="text-xs font-semibold text-slate-900">{p.nama_pejabat}</div>
                                                <div className="text-[11px] text-slate-400 mt-0.5">NIP. {p.nip}</div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="text-xs font-medium text-slate-800">{p.jabatan}</div>
                                                <div className="text-[11px] capitalize text-slate-400">{p.jenis_pejabat}</div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="flex flex-wrap gap-1">
                                                    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                                                        p.ttd_digital
                                                            ? 'text-blue-700 bg-blue-50 ring-blue-600/20'
                                                            : 'text-slate-500 bg-slate-50 ring-slate-200'
                                                    }`}>
                                                        <FileSignature className="mr-0.5 h-2.5 w-2.5" />
                                                        TTD {p.ttd_digital ? '✓' : '✗'}
                                                    </span>
                                                    {p.stempel && (
                                                        <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 bg-purple-50 ring-1 ring-inset ring-purple-600/20">
                                                            Stempel ✓
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                                                    p.is_active
                                                        ? 'text-emerald-700 bg-emerald-50 ring-emerald-600/20'
                                                        : 'text-slate-500 bg-slate-50 ring-slate-200'
                                                }`}>
                                                    {p.is_active ? 'Aktif' : 'Non-Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2.5">
                                                <div className="flex justify-end gap-0.5">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                                        <Link href={route('kecamatan.pejabat.edit', p.id)}>
                                                            <Pencil className="h-3.5 w-3.5 text-slate-500" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(p.id)}>
                                                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                                    </Button>
                                                </div>
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
