// Components
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';
import { MailCheck, RefreshCw } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verifikasi Email Anda"
            description="Kami telah mengirimkan link verifikasi ke alamat email Anda. Silakan cek inbox atau folder spam Anda."
        >
            <Head>
                <title>Verifikasi Email - SIPADU Kabupaten Cianjur</title>
                <meta name="description" content="Verifikasi email Anda untuk mengakses layanan SIPADU Kabupaten Cianjur." />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30">
                    <MailCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
                </div>

                {status === 'verification-link-sent' && (
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-3 text-center text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        Link verifikasi baru telah dikirim ke alamat email yang Anda daftarkan.
                    </div>
                )}

                <p className="text-center text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                    Jika Anda tidak menerima email, periksa folder <strong>Spam</strong> atau klik tombol di bawah untuk mengirim ulang.
                </p>

                <Form {...send.form()} className="w-full space-y-4 text-center">
                    {({ processing }) => (
                        <>
                            <Button 
                                disabled={processing} 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                {processing ? <Spinner /> : <RefreshCw className="mr-2 h-4 w-4" />}
                                Kirim Ulang Email Verifikasi
                            </Button>

                            <TextLink
                                href={logout()}
                                className="mx-auto block text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                Keluar dari akun
                            </TextLink>
                        </>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
