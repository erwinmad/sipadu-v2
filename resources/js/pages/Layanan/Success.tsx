import { Head } from '@inertiajs/react';
import { CheckCircle2, Shield, Search, Sparkles } from 'lucide-react';
import PublicNavbar from '@/components/public-navbar';
import PublicFooter from '@/components/public-footer';

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
            <Head>
                <title>{`Permohonan Berhasil - ${layanan.nama_layanan} | SIPADU Cianjur`}</title>
                <meta name="description" content={`Permohonan ${layanan.nama_layanan} melalui SIPADU Kabupaten Cianjur berhasil. Simpan token Anda untuk melacak status permohonan.`} />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
                {/* Background */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
                </div>

                {/* Navbar */}
                <PublicNavbar showAuth={true} />

                <div className="relative z-10 flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-12">
                    <div className="w-full max-w-lg">
                        {/* Success Card */}
                        <div className="rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 shadow-2xl shadow-emerald-100/50 dark:shadow-none backdrop-blur-xl text-center">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
                            </div>

                            <h2 className="mb-2 text-2xl font-extrabold text-slate-900 dark:text-white">Permohonan Berhasil!</h2>
                            <p className="mb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Permohonan <strong>{layanan.nama_layanan}</strong> telah dikirim dan sedang diverifikasi.
                            </p>

                            {/* Token */}
                            <div className="mb-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                                <div className="mb-2 flex items-center justify-center gap-2">
                                    <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-400">Token Permohonan</h3>
                                </div>
                                <div className="mb-3 rounded-xl bg-white dark:bg-slate-950 p-4 border border-emerald-200 dark:border-emerald-900/50">
                                    <div className="text-3xl font-extrabold font-mono tracking-widest text-emerald-600 dark:text-emerald-500">{token}</div>
                                </div>
                                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                                    <strong>PENTING:</strong> Simpan token ini untuk melacak status permohonan
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a
                                    href={`/tracking?token=${token}`}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
                                >
                                    <Search className="h-4 w-4" />
                                    Lacak Permohonan
                                </a>
                                <a
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-transparent px-6 py-3 text-sm font-bold text-slate-900 dark:text-white transition-all hover:bg-slate-900 dark:hover:bg-slate-800 hover:text-white hover:-translate-y-0.5"
                                >
                                    Kembali ke Beranda
                                </a>
                            </div>

                            {/* Info */}
                            <div className="mt-8 rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 p-4 text-left">
                                <h4 className="mb-2 text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider">Langkah Selanjutnya:</h4>
                                <ul className="space-y-1.5 text-sm text-blue-700 dark:text-blue-300">
                                    <li>• Verifikasi dalam 1-3 hari kerja</li>
                                    <li>• Notifikasi email jika ada update</li>
                                    <li>• Gunakan token untuk melacak progress</li>
                                    <li>• Pastikan data valid dan dapat dihubungi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <PublicFooter />
            </div>
        </>
    );
}
