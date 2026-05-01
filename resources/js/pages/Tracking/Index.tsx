import { Head, useForm, Link } from '@inertiajs/react';
import { Search, ArrowLeft, Sparkles, BadgeCheck } from 'lucide-react';
import { FormEventHandler } from 'react';
import PublicNavbar from '@/components/public-navbar';
import PublicFooter from '@/components/public-footer';

declare var route: any;

export default function TrackingIndex() {
    const { data, setData, post, processing, errors } = useForm({
        token: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/tracking');
    };

    return (
        <>
            <Head>
                <title>Lacak Permohonan Dokumen - SIPADU Kabupaten Cianjur</title>
                <meta name="description" content="Lacak status permohonan dokumen kependudukan atau perizinan Anda secara real-time di SIPADU Kabupaten Cianjur melalui token permohonan." />
                <meta name="keywords" content="Lacak Permohonan, Tracking SIPADU, Status Dokumen, Cianjur, Kabupaten Cianjur" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sipadu.cianjurkab.go.id/tracking" />
                <meta property="og:title" content="Lacak Permohonan Dokumen - SIPADU Kabupaten Cianjur" />
                <meta property="og:description" content="Ketahui status terkini dari dokumen yang Anda ajukan di Pelayanan Terpadu Kabupaten Cianjur." />
                <meta property="og:image" content="https://sipadu.cianjurkab.go.id/logo/sugih-mukti.png" />
            </Head>

            <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-100 selection:text-emerald-700 text-slate-900 dark:text-slate-50">
                {/* Background */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
                </div>

                {/* Navbar */}
                <PublicNavbar showBack={true} showAuth={true} />

                {/* Main */}
                <main className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="grid gap-12 lg:grid-cols-12 items-start">

                            {/* Left Column: Info */}
                            <div className="lg:col-span-5 lg:py-8 space-y-8">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-6">
                                        <BadgeCheck className="h-3.5 w-3.5" />
                                        Lacak Status
                                    </div>
                                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-5xl mb-4">
                                        Lacak <span className="text-emerald-600 dark:text-emerald-500">Permohonan</span>
                                    </h1>
                                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Masukkan token permohonan untuk melihat status dan progress pengajuan Anda secara real-time.
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    <FeatureItem
                                        icon={<SearchIcon className="h-5 w-5 text-emerald-600" />}
                                        title="Cek Status Instan"
                                        desc="Dapatkan informasi terkini tentang permohonan Anda dalam hitungan detik."
                                    />
                                    <FeatureItem
                                        icon={<ShieldIcon className="h-5 w-5 text-emerald-600" />}
                                        title="Data Aman"
                                        desc="Token permohonan unik hanya bisa digunakan untuk melihat data permohonan Anda."
                                    />
                                </div>

                                <div className="rounded-2xl bg-emerald-600 p-6 text-white shadow-xl shadow-emerald-900/10">
                                    <p className="text-sm font-medium text-emerald-100 mb-2">Lupa Token?</p>
                                    <p className="text-xs text-emerald-200 mb-4">Cek email konfirmasi saat pengajuan atau hubungi admin untuk mendapatkan token kembali.</p>
                                    <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/20">
                                        Hubungi Admin
                                    </button>
                                </div>
                            </div>

                            {/* Right Column — Form */}
                            <div className="lg:col-span-7">
                                <div className="rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6 shadow-2xl shadow-emerald-100/50 dark:shadow-none backdrop-blur-xl sm:p-10">
                                    <div className="mb-8 text-center">
                                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                                            <Search className="h-7 w-7 text-emerald-600 dark:text-emerald-500" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Masukkan Token</h2>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1">Token 8 karakter alfanumerik</p>
                                    </div>

                                    <form onSubmit={submit} className="space-y-6">
                                        <div>
                                            <label htmlFor="token" className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                Token Permohonan
                                            </label>
                                            <input
                                                id="token"
                                                type="text"
                                                value={data.token}
                                                onChange={(e) => setData('token', e.target.value.toUpperCase())}
                                                placeholder="Contoh: A1B2C3D4"
                                                maxLength={8}
                                                className="w-full h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 text-center text-xl font-mono font-bold uppercase tracking-[0.3em] transition-all focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                            />
                                            {errors.token && (
                                                <p className="mt-2 text-sm text-red-600 font-semibold">{errors.token}</p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing || data.token.length !== 8}
                                            className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                                        >
                                            {processing ? 'Mencari...' : 'Lacak Permohonan'}
                                        </button>
                                    </form>

                                    {/* Info */}
                                    <div className="mt-8 rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 p-4">
                                        <h3 className="mb-2 text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">Informasi Penting</h3>
                                        <ul className="space-y-1.5 text-sm text-blue-700 dark:text-blue-400">
                                            <li>• Token diberikan setelah berhasil mengajukan layanan</li>
                                            <li>• Simpan token dengan baik untuk melacak status</li>
                                            <li>• Jika lupa token, hubungi admin atau cek email konfirmasi</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <PublicFooter />
            </div>
        </>
    );
}

// -- Components --

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="shrink-0 mt-1">{icon}</div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{desc}</p>
            </div>
        </div>
    );
}

function SearchIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> }
function ShieldIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg> }
