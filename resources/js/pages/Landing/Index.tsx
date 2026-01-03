import { Head } from '@inertiajs/react';
import { ArrowUpRight, CheckCircle2, FileText, Search, Shield, Users, Clock, TrendingUp } from 'lucide-react';

// Import Wayfinder action
import { show } from '@/actions/App/Http/Controllers/LayananPublicController';

interface Layanan {
    id: number;
    nama_layanan: string;
    slug: string;
    deskripsi: string;
    is_active: boolean;
}

interface Stats {
    total_permohonan: number;
    permohonan_selesai: number;
    permohonan_proses: number;
    total_pengguna: number;
}

interface PageProps {
    layanans: Layanan[];
    stats: Stats;
}

export default function LandingPage({ layanans, stats }: PageProps) {
    // Generate initials for generic icons
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    return (
        <>
            <Head title="SIPADU - Kabupaten Cianjur" />
            
            <div className="relative min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-500 selection:text-white">
                
                {/* Background Pattern - Dot Grid halus agar tidak plain */}
                <div className="absolute inset-0 z-0 opacity-[0.03]" 
                    style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                </div>

                {/* Navbar - Floating Glass */}
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
                                <a href="/login" className="text-xs font-bold text-slate-600 transition-colors hover:text-emerald-700">
                                    MASUK
                                </a>
                                <a
                                    href="/register"
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
                                >
                                    DAFTAR
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section - Asymmetrical & Bold */}
                <main className="relative z-10 pt-24 pb-12 lg:pt-28 lg:pb-16">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="grid gap-8 lg:grid-cols-12 items-center text-center lg:text-left">
                            
                            {/* Left Content */}
                            <div className="lg:col-span-7">
                                <div className="mb-4 inline-flex items-center rounded-full border border-emerald-100 bg-white px-3 py-1 shadow-sm">
                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Portal Layanan Digital v2.0</span>
                                </div>
                                <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[0.95]">
                                    Urus Dokumen <br/>
                                    <span className="text-emerald-600">Tanpa Antri.</span>
                                </h1>
                                <p className="mb-6 text-base font-medium text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    Sistem pelayanan administrasi terpadu satu pintu. 
                                    Mengajukan SKTM, Surat Domisili, hingga Izin Usaha kini bisa dilakukan dari rumah.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                    <a href="#layanan" className="group inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-1">
                                        LIHAT SEMUA LAYANAN
                                        <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </a>
                                    <a href="/tracking" className="group inline-flex items-center justify-center rounded-lg border-2 border-slate-900 bg-transparent px-6 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-slate-900 hover:text-white hover:-translate-y-1">
                                        <Search className="mr-2 h-4 w-4" />
                                        LACAK PERMOHONAN
                                    </a>
                                </div>

                                {/* Stats Strip */}
                                <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-6 border-t border-slate-200 pt-6">
                                    <div>
                                        <div className="text-xl font-black text-slate-900">{layanans.length}+</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Jenis Layanan</div>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200"></div>
                                    <div>
                                        <div className="text-xl font-black text-slate-900">24/7</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Online System</div>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200"></div>
                                    <div>
                                        <div className="text-xl font-black text-slate-900">Resmi</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pemkab Cianjur</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content - Bupati Photo & Visuals */}
                            <div className="hidden lg:block lg:col-span-5 relative">
                                <div className="relative z-10 flex justify-center">
                                    <div className="relative">
                                        <img 
                                            src="/images/bupati-cianjur.webp" 
                                            alt="dr. Muhammad Wahyu Ferdian - Bupati Cianjur" 
                                            className="relative z-10 w-full max-w-[300px] drop-shadow-2xl"
                                        />
                                        
                                        {/* Floating Name Card */}
                                        <div className="absolute -bottom-4 -right-3 z-20 rounded-xl bg-white/90 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white backdrop-blur-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700"></div>
                                                <div>
                                                    <h3 className="text-base font-black text-slate-900 leading-tight">dr. M. Wahyu Ferdian</h3>
                                                    <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 mt-0.5">Bupati Cianjur</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Decorative Elements behind photo */}
                                        <div className="absolute top-8 -right-6 h-20 w-20 rounded-full border-4 border-emerald-500/10 z-0"></div>
                                        <div className="absolute bottom-8 -left-6 h-24 w-24 rounded-full border-4 border-amber-500/10 z-0"></div>
                                    </div>
                                </div>
                                
                                {/* Decorative Blobs */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-200/50 to-amber-200/50 rounded-full blur-[60px] -z-10"></div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Statistics Section */}
                <section className="relative z-10 pb-12">
                    <div className="container mx-auto px-4 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Total Permohonan */}
                                <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-emerald-500">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-600">
                                            <TrendingUp className="h-3 w-3" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-black text-slate-900">{formatNumber(stats.total_permohonan)}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Permohonan</div>
                                </div>

                                {/* Permohonan Selesai */}
                                <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-blue-500">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        <div className="text-xs font-bold text-blue-600">
                                            {stats.total_permohonan > 0 ? Math.round((stats.permohonan_selesai / stats.total_permohonan) * 100) : 0}%
                                        </div>
                                    </div>
                                    <div className="text-2xl font-black text-slate-900">{formatNumber(stats.permohonan_selesai)}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Selesai Diproses</div>
                                </div>

                                {/* Sedang Diproses */}
                                <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-amber-500">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div className="flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-black text-slate-900">{formatNumber(stats.permohonan_proses)}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Sedang Diproses</div>
                                </div>

                                {/* Total Pengguna */}
                                <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:border-purple-500">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <Users className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-black text-slate-900">{formatNumber(stats.total_pengguna)}</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Pengguna Terdaftar</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search & Services Section */}
                <section id="layanan" className="relative z-10 pb-20">
                    <div className="container mx-auto px-4 lg:px-8">
                        
                        {/* Search Bar - Floating */}
                        <div className="relative -mt-8 mb-10 mx-auto max-w-2xl">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                                <div className="relative flex items-center bg-white rounded-xl shadow-lg p-1.5 border border-slate-100">
                                    <div className="pl-3 text-slate-400">
                                        <Search className="h-4 w-4" />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder="Cari layanan apa hari ini? (Misal: KTP, Nikah, Usaha)" 
                                        className="w-full border-none bg-transparent px-3 py-2 text-sm font-medium focus:ring-0 placeholder:text-slate-400"
                                    />
                                    <button className="hidden sm:block rounded-lg bg-slate-900 px-5 py-2 text-xs font-bold text-white uppercase tracking-wider transition-colors hover:bg-slate-800">
                                        Cari
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Services Grid */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {layanans.map((layanan) => (
                                <a 
                                    key={layanan.id}
                                    href={show.url(layanan.slug)}
                                    className="group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-5 transition-all hover:border-emerald-500 hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)]"
                                >
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="h-10 w-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-base font-bold text-slate-700 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors">
                                            {getInitials(layanan.nama_layanan)}
                                        </div>
                                        <div className="h-6 w-6 rounded-full bg-slate-50 flex items-center justify-center -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0 translate-x-4">
                                            <ArrowUpRight className="h-3 w-3 text-slate-900" />
                                        </div>
                                    </div>

                                    <h3 className="mb-1.5 text-base font-bold text-slate-900 leading-tight">
                                        {layanan.nama_layanan}
                                    </h3>
                                    
                                    <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
                                        {layanan.deskripsi || 'Layanan administrasi resmi kependudukan.'}
                                    </p>

                                    {/* Bottom Accent */}
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-500 transition-all group-hover:w-full"></div>
                                </a>
                            ))}
                        </div>

                        {layanans.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                                <div className="h-12 w-12 mb-3 rounded-full bg-white shadow-sm flex items-center justify-center">
                                    <Search className="h-5 w-5 text-slate-300" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">Belum ada layanan tersedia</h3>
                                <p className="text-slate-500 text-xs">Silakan cek kembali nanti</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer - Simple & Clean */}
                <footer className="bg-white border-t border-slate-200 pt-10 pb-6">
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
