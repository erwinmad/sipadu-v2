import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, LogOut } from 'lucide-react';

interface PublicNavbarProps {
    subtitle?: string;
    showAuth?: boolean;
    showBack?: boolean;
    backHref?: string;
    backLabel?: string;
    rightContent?: React.ReactNode;
}

export default function PublicNavbar({
    subtitle = 'Kabupaten Cianjur',
    showAuth = false,
    showBack = false,
    backHref = '/',
    backLabel = 'Beranda',
    rightContent,
}: PublicNavbarProps) {
    const { auth } = usePage<{ auth?: { user: any }; [key: string]: any }>().props;

    return (
        <nav className="border-b border-white/50 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-6 py-4 backdrop-blur-md sticky top-0 z-50">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <a href="/" className="flex items-center gap-3" aria-label="Kembali ke Halaman Utama">
                    <img 
                        src="/logo/sugih-mukti.png" 
                        alt="Logo Kabupaten Cianjur" 
                        width="36" 
                        height="36" 
                        className="h-9 w-auto" 
                        loading="eager"
                        fetchPriority="high"
                    />
                    <div>
                        <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">SIPADU V2</h1>
                        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>
                    </div>
                </a>

                <div className="flex items-center gap-3">
                    {showBack && (
                        <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400">
                            <ArrowLeft className="h-4 w-4" />
                            {backLabel}
                        </Link>
                    )}

                    {rightContent}

                    {showAuth && (
                        <>
                            {auth?.user ? (
                                <>
                                    <a href="/dashboard" className="text-sm font-semibold text-emerald-600 dark:text-emerald-500 transition-colors hover:text-emerald-700 dark:hover:text-emerald-400 px-2 py-1">
                                        Dashboard
                                    </a>
                                    <Link href="/logout" method="post" as="button" className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-rose-700 hover:-translate-y-0.5">
                                        <LogOut className="h-4 w-4" />
                                        Keluar
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <a href="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-1">
                                        Masuk
                                    </a>
                                    <a href="/register" className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5">
                                        Daftar
                                    </a>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
