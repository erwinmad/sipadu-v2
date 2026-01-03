import { Head, useForm } from '@inertiajs/react';
import { Search, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';

declare var route: any;

export default function TrackingIndex() {
    const { data, setData, post, processing, errors } = useForm({
        token: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('tracking.show'));
    };

    return (
        <>
            <Head title="Lacak Permohonan - SIPADU" />
            
            <div className="relative min-h-screen bg-[#F8FAFC] font-sans">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                </div>

                {/* Navbar - Consistent with Landing */}
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
                            <div className="flex items-center gap-3">
                                <a href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 transition-colors hover:text-emerald-700">
                                    <ArrowLeft className="h-3 w-3" />
                                    Beranda
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="relative z-10 pt-24 pb-12 lg:pt-28 lg:pb-16">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="mx-auto max-w-2xl">
                            {/* Title */}
                            <div className="mb-8 text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                                    <Search className="h-8 w-8 text-emerald-600" />
                                </div>
                                <h1 className="mb-2 text-3xl font-black text-slate-900">Lacak Permohonan</h1>
                                <p className="text-base text-slate-600">
                                    Masukkan token permohonan Anda untuk melihat status dan progress pengajuan layanan
                                </p>
                            </div>

                            {/* Form Card */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                                <form onSubmit={submit}>
                                    <div className="mb-6">
                                        <label htmlFor="token" className="mb-2 block text-sm font-bold text-slate-900">
                                            Token Permohonan
                                        </label>
                                        <input
                                            id="token"
                                            type="text"
                                            value={data.token}
                                            onChange={(e) => setData('token', e.target.value.toUpperCase())}
                                            placeholder="Contoh: A1B2C3D4"
                                            maxLength={8}
                                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-lg font-mono font-bold uppercase tracking-wider transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                        {errors.token && (
                                            <p className="mt-2 text-sm text-red-600">{errors.token}</p>
                                        )}
                                        <p className="mt-2 text-xs text-slate-500">
                                            Token terdiri dari 8 karakter alfanumerik yang Anda terima setelah mengajukan permohonan
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || data.token.length !== 8}
                                        className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                                    >
                                        {processing ? 'Mencari...' : 'Lacak Permohonan'}
                                    </button>
                                </form>
                            </div>

                            {/* Info Box */}
                            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                                <h3 className="mb-2 text-sm font-bold text-blue-900">Informasi Penting</h3>
                                <ul className="space-y-1 text-xs text-blue-700">
                                    <li>• Token permohonan diberikan setelah Anda berhasil mengajukan layanan</li>
                                    <li>• Simpan token dengan baik untuk melacak status permohonan Anda</li>
                                    <li>• Jika lupa token, silakan hubungi admin atau periksa email konfirmasi</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer - Consistent with Landing */}
                <footer className="relative z-10 bg-white border-t border-slate-200 pt-10 pb-6">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                            <div>
                                <img src="/logo/sugih-mukti.png" alt="Logo Cianjur" className="h-10 w-auto mb-4 grayscale opacity-90" />
                                <p className="text-xs font-medium text-slate-500 max-w-xs leading-relaxed">
                                    Menghadirkan pelayanan publik yang transparan, akuntabel, dan efisien untuk masyarakat Cianjur.
                                </p>
                            </div>
                            <div className="flex gap-10">
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Layanan</h4>
                                    <ul className="space-y-2 text-xs font-medium text-slate-500">
                                        <li><a href="#" className="hover:text-emerald-600">Kependudukan</a></li>
                                        <li><a href="#" className="hover:text-emerald-600">Perizinan</a></li>
                                        <li><a href="#" className="hover:text-emerald-600">Kesehatan</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Bantuan</h4>
                                    <ul className="space-y-2 text-xs font-medium text-slate-500">
                                        <li><a href="#" className="hover:text-emerald-600">Panduan</a></li>
                                        <li><a href="#" className="hover:text-emerald-600">F.A.Q</a></li>
                                        <li><a href="#" className="hover:text-emerald-600">Kontak Kami</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-[10px] font-bold text-slate-400">
                                &copy; 2026 SIPADU KAB. CIANJUR
                            </div>
                            <div className="flex gap-3">
                                {/* Social icons placeholder */}
                                <div className="h-6 w-6 rounded-full bg-slate-50"></div>
                                <div className="h-6 w-6 rounded-full bg-slate-50"></div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
