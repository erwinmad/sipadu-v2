import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-white p-1">
                <AppLogoIcon className="size-full" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="truncate leading-none font-bold text-slate-900 tracking-tight">
                    SIPADU v2
                </span>
                <span className="truncate text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-1">
                    Kab. Cianjur
                </span>
            </div>
        </>
    );
}
