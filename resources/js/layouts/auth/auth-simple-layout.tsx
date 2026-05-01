import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { ArrowLeft } from 'lucide-react';
import PublicNavbar from '@/components/public-navbar';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { app_settings } = usePage<{ app_settings: any; [key: string]: any }>().props;

    return (
        <div className="relative min-h-screen bg-[#F8FAFC] font-sans">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" 
                style={{ backgroundImage: 'radial-gradient(#059669 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            {/* Navbar - Consistent with Landing */}
            <PublicNavbar 
                subtitle="Otentikasi Sistem" 
                showBack={true} 
                backHref="/" 
                backLabel="Kembali ke Beranda" 
            />

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
