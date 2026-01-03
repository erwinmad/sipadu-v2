import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
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
                        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 transition-colors hover:text-emerald-700">
                            <ArrowLeft className="h-3 w-3" />
                            Beranda
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
                        {/* Header */}
                        <div className="mb-6 text-center">
                            <h1 className="mb-2 text-2xl font-black text-slate-900">{title}</h1>
                            <p className="text-sm text-slate-600">{description}</p>
                        </div>

                        {/* Form Content */}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
