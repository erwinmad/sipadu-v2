import { Head } from '@inertiajs/react';
import { CheckCircle2, Shield, Search } from 'lucide-react';

interface Layanan {
    id: number;
    nama_layanan: string;
    slug: string;
    deskripsi: string;
}

interface PageProps {
    layanan: Layanan;
    token: string;
}

export default function Success({ layanan, token }: PageProps) {
    return (
        <>
            <Head title={`Permohonan Berhasil - ${layanan.nama_layanan}`} />
            
            <div className="relative min-h-screen bg-[#F8FAFC] font-sans">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                </div>

                {/* Navbar */}
                <nav className="fixed left-0 right-0 top-0 z-50 px-4 py-3 lg:px-8">
                    <div className="mx-auto max-w-7xl rounded-xl border border-white/40 bg-white/80 px-5 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img src="/logo/sugih-mukti.png" alt="Logo Cianjur" className="h-8 w-auto drop-shadow-sm" />
                                <div className="hidden sm:block">
                                    <h1 className="text-sm font-bold tracking-tight text-slate-900 leading-none">SIPADU</h1>
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">Kabupaten Cianjur</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-24">
                    <div className="w-full max-w-2xl">
                        {/* Success Card */}
                        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-lg text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                            </div>
                            
                            <h2 className="mb-3 text-3xl font-black text-slate-900">Permohonan Berhasil Dikirim!</h2>
                            <p className="mb-8 text-base text-slate-600">
                                Terima kasih. Permohonan Anda untuk <strong>{layanan.nama_layanan}</strong> telah berhasil dikirim dan sedang dalam proses verifikasi.
                            </p>

                            {/* Token Display */}
                            <div className="mb-8 rounded-xl border-2 border-emerald-500 bg-emerald-50 p-6">
                                <div className="mb-3 flex items-center justify-center gap-2">
                                    <Shield className="h-5 w-5 text-emerald-600" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900">Token Permohonan Anda</h3>
                                </div>
                                <div className="mb-4 rounded-lg bg-white p-4 border border-emerald-200">
                                    <div className="text-4xl font-black font-mono tracking-widest text-emerald-600">{token}</div>
                                </div>
                                <p className="text-xs font-medium text-emerald-800">
                                    <strong>PENTING:</strong> Simpan token ini dengan baik untuk melacak status permohonan Anda
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a 
                                    href={`/tracking?token=${token}`}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
                                >
                                    <Search className="h-4 w-4" />
                                    Lacak Permohonan
                                </a>
                                <a 
                                    href="/" 
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-900 bg-transparent px-6 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-slate-900 hover:text-white hover:-translate-y-0.5"
                                >
                                    Kembali ke Beranda
                                </a>
                            </div>

                            {/* Info Box */}
                            <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4 text-left">
                                <h4 className="mb-2 text-sm font-bold text-blue-900">Langkah Selanjutnya:</h4>
                                <ul className="space-y-1 text-xs text-blue-700">
                                    <li>• Permohonan Anda akan diverifikasi dalam 1-3 hari kerja</li>
                                    <li>• Anda akan menerima notifikasi email jika ada update status</li>
                                    <li>• Gunakan token di atas untuk melacak progress permohonan</li>
                                    <li>• Pastikan data yang Anda berikan valid dan dapat dihubungi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
