import { Link, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';

export default function PublicFooter() {
    const { app_settings } = usePage<{ app_settings: any; [key: string]: any }>().props;

    return (
        <footer className="bg-emerald-950 border-t border-emerald-900 pt-10 pb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
            
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                    <div>
                        <img src={app_settings?.app_logo || "/logo/sugih-mukti.png"} alt="Logo" className="h-10 w-auto mb-4 grayscale opacity-90 brightness-200" />
                        <p className="text-sm text-emerald-100/80 max-w-xs leading-relaxed">
                            {app_settings?.app_description || "Pelayanan publik yang transparan, akuntabel, dan efisien."}
                        </p>
                    </div>
                    <div className="flex gap-12">
                        <div>
                            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Sosial Media</h4>
                            <ul className="space-y-2 text-sm text-emerald-200">
                                {app_settings?.social_instagram && <li><a href={app_settings.social_instagram} target="_blank" className="hover:text-white transition-colors">Instagram</a></li>}
                                {app_settings?.social_facebook && <li><a href={app_settings.social_facebook} target="_blank" className="hover:text-white transition-colors">Facebook</a></li>}
                                {app_settings?.social_twitter && <li><a href={app_settings.social_twitter} target="_blank" className="hover:text-white transition-colors">X / Twitter</a></li>}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Kontak</h4>
                            <ul className="space-y-2 text-sm text-emerald-200">
                                <li><span className="text-emerald-400">Telp:</span> {app_settings?.contact_phone || "-"}</li>
                                <li><span className="text-emerald-400">Email:</span> {app_settings?.contact_email || "-"}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="border-t border-emerald-800/60 pt-5 flex items-center justify-between">
                    <div className="text-xs font-medium text-emerald-400/60 flex items-center gap-1">
                        &copy; {new Date().getFullYear()} {app_settings?.app_name || "SIPADU"}. Dibuat dengan 
                        <Heart className="h-3 w-3 text-red-500 fill-current mx-0.5" /> 
                        oleh Diskominfo Kabupaten Cianjur
                    </div>
                </div>
            </div>
        </footer>
    );
}
