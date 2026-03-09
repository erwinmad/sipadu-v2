import { Head, usePage, Link, router } from '@inertiajs/react';
import { ArrowUpRight, FileText, Search, CreditCard, Heart, Baby, FileBadge, Building, Briefcase, GraduationCap, FileCheck, LogOut, Sparkles, ShieldCheck, BadgeCheck, BarChart3, PieChart as PieChartIcon, CalendarDays } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useState } from 'react';
import PublicNavbar from '@/components/public-navbar';
import BeritaCianjurkab from '@/components/berita-cianjurkab';

// Import Wayfinder action
import { show } from '@/actions/App/Http/Controllers/LayananPublicController';

interface Layanan {
    id: number;
    nama_layanan: string;
    slug: string;
    deskripsi: string;
    is_active: boolean;
}

interface PermohonanByJenis {
    jenis: string;
    total: number;
}

interface PermohonanByKecamatan {
    kecamatan: string;
    total: number;
}

interface PageProps {
    layanans: Layanan[];
    auth?: { user: any };
    stats: {
        total_permohonan: number;
        permohonan_selesai: number;
        permohonan_proses: number;
        total_pengguna: number;
        total_kecamatan?: number;
        total_desa?: number;
    };
    permohonanByJenis: PermohonanByJenis[];
    permohonanByKecamatan: PermohonanByKecamatan[];
    tahun: number;
    availableYears: number[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function LandingPage({ layanans, stats, permohonanByJenis, permohonanByKecamatan, tahun, availableYears }: PageProps) {
    const { auth } = usePage<{ auth?: { user: any }; [key: string]: any }>().props;
    const [selectedYear, setSelectedYear] = useState(tahun);

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
        router.get('/', { tahun: year }, { preserveState: true, preserveScroll: true });
    };

    const getServiceIcon = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('ktp') || lower.includes('identitas')) return <CreditCard className="h-5 w-5" />;
        if (lower.includes('akta') || lower.includes('lahir') || lower.includes('mati')) return <Baby className="h-5 w-5" />;
        if (lower.includes('nikah') || lower.includes('kawin')) return <Heart className="h-5 w-5" />;
        if (lower.includes('izin') || lower.includes('usaha')) return <FileBadge className="h-5 w-5" />;
        if (lower.includes('bangunan') || lower.includes('imb')) return <Building className="h-5 w-5" />;
        if (lower.includes('kerja') || lower.includes('lowongan')) return <Briefcase className="h-5 w-5" />;
        if (lower.includes('sekolah') || lower.includes('pendidikan')) return <GraduationCap className="h-5 w-5" />;
        if (lower.includes('surat') || lower.includes('keterangan')) return <FileCheck className="h-5 w-5" />;
        return <FileText className="h-5 w-5" />;
    };

    const totalByJenis = permohonanByJenis.reduce((sum, item) => sum + item.total, 0);

    const CustomTooltipBar = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 shadow-xl">
                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">{label}</p>
                    <p className="text-sm font-extrabold text-emerald-600">{payload[0].value} permohonan</p>
                </div>
            );
        }
        return null;
    };

    const CustomTooltipPie = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 shadow-xl">
                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">{payload[0].name}</p>
                    <p className="text-sm font-extrabold" style={{ color: payload[0].payload.fill }}>{payload[0].value} permohonan</p>
                </div>
            );
        }
        return null;
    };

    // Schema.org Structured Data for Government Service
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "GovernmentService",
        "name": "SIPADU Kabupaten Cianjur",
        "alternateName": "Sistem Pelayanan Administrasi Terpadu",
        "url": "https://sipadu.cianjurkab.go.id",
        "description": "Sistem pelayanan administrasi terpadu satu pintu Kabupaten Cianjur. Melayani pembuatan Administrasi Kependudukan, Perizinan, dan dokumen publik lainnya secara mandiri dan cepat tanpa antri.",
        "provider": {
            "@type": "GovernmentOrganization",
            "name": "Pemerintah Kabupaten Cianjur",
            "department": {
                "@type": "GovernmentOrganization",
                "name": "Dinas Komunikasi dan Informatika",
                "url": "https://diskominfo.cianjurkab.go.id"
            }
        },
        "areaServed": {
            "@type": "AdministrativeArea",
            "name": "Kabupaten Cianjur",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Cianjur",
                "addressRegion": "Jawa Barat",
                "addressCountry": "ID"
            }
        }
    };

    return (
        <>
            <Head>
                <title>SIPADU - Portal Layanan Digital Pemerintah Kabupaten Cianjur</title>
                <meta name="description" content="SIPADU (Sistem Pelayanan Administrasi Terpadu) Kabupaten Cianjur. Layanan instan untuk pembuatan SKTM, Domisili, Nikah, dan Izin Usaha tanpa antri secara online." />
                <meta name="keywords" content="SIPADU, Cianjur, Kabupaten Cianjur, SKTM Online, Surat Domisili, Layanan Publik Cianjur, Administrasi Kependudukan, e-Government Cianjur" />
                <meta name="author" content="Diskominfo Kabupaten Cianjur" />
                <meta name="robots" content="index, follow" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://sipadu.cianjurkab.go.id" />
                <meta property="og:title" content="SIPADU - Portal Layanan Digital Pemerintah Kabupaten Cianjur" />
                <meta property="og:description" content="Sistem Pelayanan Administrasi Terpadu. Ajukan dokumen administrasi publik Anda dari rumah dengan mudah, aman, dan tanpa biaya." />
                <meta property="og:image" content="https://sipadu.cianjurkab.go.id/logo/sugih-mukti.png" />
                <meta property="og:site_name" content="SIPADU Kabupaten Cianjur" />
                
                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://sipadu.cianjurkab.go.id" />
                <meta property="twitter:title" content="SIPADU - Portal Layanan Digital Pemerintah Kabupaten Cianjur" />
                <meta property="twitter:description" content="Sistem Pelayanan Administrasi Terpadu. Ajukan dokumen administrasi publik Anda dari rumah dengan mudah, aman, dan tanpa biaya." />
                <meta property="twitter:image" content="https://sipadu.cianjurkab.go.id/logo/sugih-mukti.png" />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Head>

            <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-emerald-100 selection:text-emerald-700 text-slate-900 dark:text-slate-50">

                {/* Background */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
                </div>

                {/* Navbar */}
                <PublicNavbar showAuth={true} />

                <div className="relative z-10 flex min-h-[calc(100vh-65px)] flex-col">

                    {/* Hero */}
                    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid gap-12 lg:grid-cols-12 items-center">

                                {/* Left Column */}
                                <div className="lg:col-span-7 lg:py-8 space-y-8">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-6">
                                            <BadgeCheck className="h-3.5 w-3.5" />
                                            Portal Layanan Digital v2.0
                                        </div>
                                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-5xl mb-4 leading-[0.95]">
                                            Urus Dokumen <br/>
                                            <span className="text-emerald-600 dark:text-emerald-500">Tanpa Antri.</span>
                                        </h1>
                                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                                            Sistem pelayanan administrasi terpadu satu pintu.
                                            Mengajukan SKTM, Surat Domisili, hingga Izin Usaha kini bisa dilakukan dari rumah.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <a href="#layanan" className="group inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-emerald-600/30">
                                            LIHAT LAYANAN
                                            <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </a>
                                        <a href="/tracking" className="group inline-flex items-center justify-center rounded-xl border-2 border-slate-900 dark:border-white bg-transparent px-6 py-3.5 text-sm font-bold text-slate-900 dark:text-white transition-all hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 hover:-translate-y-0.5">
                                            <Search className="mr-2 h-4 w-4" />
                                            LACAK PERMOHONAN
                                        </a>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <FeatureItem
                                            icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
                                            title="Keamanan Terjamin"
                                            desc="Data Anda dienkripsi dan dilindungi dengan standar keamanan tinggi."
                                        />
                                        <FeatureItem
                                            icon={<ZapIcon className="h-5 w-5 text-emerald-600" />}
                                            title="Layanan Instan"
                                            desc="Ajukan surat dan perizinan tanpa perlu antre di kantor fisik."
                                        />
                                        <FeatureItem
                                            icon={<FolderIcon className="h-5 w-5 text-emerald-600" />}
                                            title="Arsip Digital"
                                            desc="Dokumen Anda tersimpan rapi dan dapat diakses kapan saja."
                                        />
                                    </div>
                                </div>

                                {/* Right Column — Bupati */}
                                <div className="hidden lg:block lg:col-span-5 relative">
                                    <div className="relative z-10 flex justify-center">
                                        <div className="relative">
                                            <img
                                                src="/images/bupati-cianjur.webp"
                                                alt="dr. Muhammad Wahyu Ferdian - Bupati Cianjur"
                                                className="relative z-10 w-full max-w-[320px] drop-shadow-2xl"
                                                width="320"
                                                height="424"
                                                loading="eager"
                                                fetchPriority="high"
                                            />
                                            <div className="absolute -bottom-4 -right-4 z-20 rounded-2xl bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xl shadow-emerald-100/50 dark:shadow-none border border-white/60 dark:border-slate-800 backdrop-blur-xl">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-1 rounded-full bg-emerald-600"></div>
                                                    <div>
                                                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">dr. M. Wahyu Ferdian</h3>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500 mt-0.5">Bupati Cianjur</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute top-8 -right-8 h-20 w-20 rounded-full border-4 border-emerald-500/10 z-0"></div>
                                            <div className="absolute bottom-8 -left-8 h-24 w-24 rounded-full border-4 border-amber-500/10 z-0"></div>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-[100px] -z-10"></div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Services */}
                    <section id="layanan" className="relative z-10 pb-16 px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">

                            <div className="mb-10 text-center">
                                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-4">
                                    <FileText className="h-3.5 w-3.5" />
                                    Layanan Tersedia
                                </div>
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">Pilih Layanan Anda</h2>
                                <p className="text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                                    Klik salah satu layanan di bawah ini untuk memulai pengajuan permohonan.
                                </p>
                            </div>

                            {/* Search */}
                            <div className="relative mb-8 mx-auto max-w-xl">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur opacity-15 group-hover:opacity-25 transition-opacity"></div>
                                    <div className="relative flex items-center bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-2xl shadow-emerald-100/50 dark:shadow-none p-1.5 border border-white/60 dark:border-slate-800 backdrop-blur-xl">
                                        <div className="pl-4 text-slate-400" aria-hidden="true">
                                            <Search className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Cari layanan... (KTP, Nikah, Usaha)"
                                            aria-label="Cari layanan"
                                            className="w-full border-none bg-transparent px-3 py-2.5 text-sm font-medium focus:ring-0 placeholder:text-slate-400 dark:text-white"
                                        />
                                        <button 
                                            aria-label="Tombol cari layanan"
                                            className="hidden sm:block rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white uppercase tracking-wider transition-colors hover:bg-emerald-700"
                                        >
                                            Cari
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {layanans.map((layanan) => (
                                    <a
                                        key={layanan.id}
                                        href={show.url(layanan.slug)}
                                        className="group relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-gradient-to-b from-white/90 to-white/60 dark:from-slate-900/90 dark:to-slate-900/60 p-6 shadow-md shadow-emerald-900/5 dark:shadow-none backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500/50 hover:bg-gradient-to-br hover:from-white/95 hover:to-emerald-50/80 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:from-slate-800 dark:hover:to-emerald-950/20 focus:outline-none"
                                    >
                                        <div className="absolute inset-0 bg-emerald-500/0 transition-colors duration-500 group-hover:bg-emerald-500/[0.02] dark:group-hover:bg-emerald-400/[0.02]"></div>
                                        
                                        <div className="relative z-10 mb-5 flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/50 dark:to-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200/50 dark:border-emerald-800/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-emerald-500/20 group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white group-hover:border-emerald-600">
                                                {getServiceIcon(layanan.nama_layanan)}
                                            </div>
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 transition-all duration-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:-translate-y-1 group-hover:translate-x-1">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </div>
                                        </div>

                                        <div className="relative z-10">
                                            <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                                {layanan.nama_layanan}
                                            </h3>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                                {layanan.deskripsi || 'Layanan administrasi resmi kependudukan.'}
                                            </p>
                                        </div>

                                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500 ease-out group-hover:w-full"></div>
                                    </a>
                                ))}
                            </div>

                            {layanans.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                                    <Search className="h-8 w-8 text-slate-300 mb-3" />
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Belum ada layanan</h3>
                                    <p className="text-sm text-slate-500 mt-1">Silakan cek kembali nanti</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* CTA Card */}
                    <section className="px-4 sm:px-6 lg:px-8 pb-12">
                        <div className="mx-auto max-w-7xl">
                            <div className="rounded-3xl bg-emerald-600 p-8 sm:p-12 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10 max-w-2xl">
                                    <p className="text-sm font-medium text-emerald-100 mb-2">Butuh Bantuan?</p>
                                    <h3 className="text-2xl font-extrabold mb-3">Tim support kami siap membantu Anda 24/7</h3>
                                    <p className="text-sm text-emerald-200 mb-6 max-w-lg">
                                        Jika mengalami kendala dalam mengajukan permohonan atau melacak status dokumen, jangan ragu untuk menghubungi kami.
                                    </p>
                                    <button className="text-sm font-bold bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-colors border border-white/20">
                                        Hubungi Admin
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Statistics Section — below CTA */}
                    <section id="statistik" className="relative z-10 pb-12 px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-7xl">

                            {/* Section Header + Year Filter */}
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
                                        <BarChart3 className="h-3.5 w-3.5" />
                                        Statistik Layanan
                                    </div>
                                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">Data Permohonan</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Grafik permohonan layanan berdasarkan jenis dan kecamatan.
                                    </p>
                                </div>
                                {/* Year Filter Dropdown */}
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-slate-400" />
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => handleYearChange(Number(e.target.value))}
                                        className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 pr-7 text-sm font-bold text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-emerald-500/20 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2212%22%20height%3d%2212%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%2394a3b8%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%3e%3cpolyline%20points%3d%226%209%2012%2015%2018%209%22%3e%3c%2fpolyline%3e%3c%2fsvg%3e')] bg-[length:12px] bg-[right_8px_center] bg-no-repeat"
                                    >
                                        {availableYears.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Summary Stats Cards — compact */}
                            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
                                <StatCard label="Total Permohonan" value={stats.total_permohonan} color="emerald" />
                                <StatCard label="Selesai" value={stats.permohonan_selesai} color="blue" />
                                <StatCard label="Dalam Proses" value={stats.permohonan_proses} color="amber" />
                                <StatCard label="Pengguna" value={stats.total_pengguna} color="purple" />
                                <StatCard label="Kecamatan" value={stats.total_kecamatan || 0} color="blue" />
                                <StatCard label="Desa" value={stats.total_desa || 0} color="emerald" />
                            </div>

                            {/* Charts Grid — donut 4, bar 8 */}
                            <div className="grid gap-4 lg:grid-cols-12">
                                {/* Donut Chart — Permohonan by Jenis */}
                                <div className="lg:col-span-4 rounded-2xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-lg shadow-emerald-100/20 dark:shadow-none backdrop-blur-xl">
                                    <div className="mb-4 flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-500">
                                            <PieChartIcon className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">By Jenis</h3>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Total: {totalByJenis}</p>
                                        </div>
                                    </div>

                                    {totalByJenis > 0 ? (
                                        <div className="h-[200px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={permohonanByJenis}
                                                        dataKey="total"
                                                        nameKey="jenis"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={80}
                                                        innerRadius={40}
                                                        strokeWidth={2}
                                                        stroke="rgba(255,255,255,0.5)"
                                                    >
                                                        {permohonanByJenis.map((_, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip content={<CustomTooltipPie />} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-[200px] flex items-center justify-center">
                                            <div className="text-center">
                                                <PieChartIcon className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Belum ada data</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Legend */}
                                    {totalByJenis > 0 && (
                                        <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                            {permohonanByJenis.map((item, index) => (
                                                <div key={item.jenis} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.jenis}</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.total}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Bar Chart — Permohonan by Kecamatan */}
                                <div className="lg:col-span-8 rounded-2xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-lg shadow-emerald-100/20 dark:shadow-none backdrop-blur-xl">
                                    <div className="mb-4 flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500">
                                            <BarChart3 className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Per Kecamatan</h3>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Top kecamatan · Tahun {selectedYear}</p>
                                        </div>
                                    </div>

                                    {permohonanByKecamatan.length > 0 ? (
                                        <div className="h-[280px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={permohonanByKecamatan.slice(0, 15)}
                                                    margin={{ top: 0, right: 10, left: -10, bottom: 50 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.15)" />
                                                    <XAxis
                                                        dataKey="kecamatan"
                                                        tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                        angle={-45}
                                                        textAnchor="end"
                                                        interval={0}
                                                    />
                                                    <YAxis
                                                        type="number"
                                                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <Tooltip content={<CustomTooltipBar />} cursor={{ fill: 'rgba(16,185,129,0.05)' }} />
                                                    <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} barSize={22} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="h-[200px] flex items-center justify-center">
                                            <div className="text-center">
                                                <BarChart3 className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Belum ada data</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Berita Cianjur */}
                    <BeritaCianjurkab />

                    {/* Footer */}
                    <footer className="bg-emerald-950 border-t border-emerald-900 pt-10 pb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
                        
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                                <div>
                                    <img src="/logo/sugih-mukti.png" alt="Logo Cianjur" className="h-10 w-auto mb-4 grayscale opacity-90 brightness-200" />
                                    <p className="text-sm text-emerald-100/80 max-w-xs leading-relaxed">
                                        Pelayanan publik yang transparan, akuntabel, dan efisien untuk masyarakat Cianjur.
                                    </p>
                                </div>
                                <div className="flex gap-12">
                                    <div>
                                        <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Layanan</h4>
                                        <ul className="space-y-2 text-sm text-emerald-200">
                                            <li><a href="#" className="hover:text-white transition-colors">Kependudukan</a></li>
                                            <li><a href="#" className="hover:text-white transition-colors">Perizinan</a></li>
                                            <li><a href="#" className="hover:text-white transition-colors">Kesehatan</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Bantuan</h4>
                                        <ul className="space-y-2 text-sm text-emerald-200">
                                            <li><a href="#" className="hover:text-white transition-colors">Panduan</a></li>
                                            <li><a href="#" className="hover:text-white transition-colors">F.A.Q</a></li>
                                            <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-emerald-800/60 pt-5 flex items-center justify-between">
                                <div className="text-xs font-medium text-emerald-400/60 flex items-center gap-1">
                                    &copy; {new Date().getFullYear()} SIPADU KAB. CIANJUR. Dibuat dengan 
                                    <Heart className="h-3 w-3 text-red-500 fill-current mx-0.5" /> 
                                    oleh Diskominfo Kabupaten Cianjur
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-6 w-6 rounded-full bg-emerald-800/60"></div>
                                    <div className="h-6 w-6 rounded-full bg-emerald-800/60"></div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}

// -- Components --

function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
    const colorMap: Record<string, string> = {
        emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-500',
        blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500',
        amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500',
        purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-500',
    };

    return (
        <div className="rounded-xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-4 py-3 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorMap[color]}`}>
                    <span className="text-sm font-extrabold">#</span>
                </div>
                <div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">{value.toLocaleString('id-ID')}</div>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
                </div>
            </div>
        </div>
    );
}

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

// Icons
function ZapIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> }
function FolderIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg> }
