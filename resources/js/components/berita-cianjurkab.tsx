import { useState, useEffect } from 'react';
import { Newspaper, AlertTriangle } from 'lucide-react';
import BeritaCianjurCard from './berita-cianjur-card';

// Define the Post interface
export interface Post {
    id: number;
    Title?: string;
    slug?: string;
    DeskripsiBaru?: string;
    tgl_tayang?: string;
    publishedAt?: string;
    createdAt?: string;
    documentId?: string;
    thumbnail?: any[];
    categories?: any[];
    Gambar?: any[];
}

export default function BeritaCianjurkab() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Retrieve base url from env or use default for image resolution
    const baseUrl = import.meta.env.VITE_STRAPI_URL || 'https://editor.cianjurkab.go.id';

    useEffect(() => {
        let isMounted = true;

        const fetchPosts = async () => {
            try {
                // Fetch directly from our local Laravel proxy endpoint
                const response = await fetch('/api/berita-cianjur');

                if (response.ok) {
                    const data = await response.json();
                    
                    if (data && data.data && Array.isArray(data.data)) {
                        if (isMounted) {
                            setPosts(data.data);
                            if (data.data.length === 0) {
                                setErrorMessage('Tidak ada berita tersedia saat ini.');
                            }
                        }
                    } else if (data && data.error) {
                        throw new Error(data.error);
                    } else {
                        throw new Error('Format respons API tidak sesuai');
                    }
                } else {
                    throw new Error(`Gagal memuat berita (Status: ${response.status})`);
                }
            } catch (e: any) {
                if (isMounted) {
                    setPosts([]);
                    setErrorMessage(`Terjadi kesalahan saat memuat berita: ${e.message}`);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchPosts();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
                    <div className="text-center sm:text-left">
                        <div className="mb-2 inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50/50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <Newspaper className="mr-1.5 h-3.5 w-3.5" />
                            Berita Daerah
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
                            Seputar Cianjur
                        </h2>
                        <p className="max-w-2xl text-base text-slate-600 dark:text-slate-400">
                            Informasi, berita, dan kegiatan terkini dari lingkungan Pemerintah Kabupaten Cianjur.
                        </p>
                    </div>
                </div>

                {/* Content Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center min-h-[400px] py-20">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600 dark:border-slate-700 dark:border-t-emerald-500"></div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Memuat berita terbaru...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {errorMessage && !isLoading && (
                    <div className="rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-6 text-center text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="mx-auto h-8 w-8 mb-3 opacity-80" />
                        <h3 className="font-bold text-lg mb-1">Gagal Memuat Berita</h3>
                        <p className="text-sm">{errorMessage}</p>
                    </div>
                )}

                {/* Content Display */}
                {!isLoading && !errorMessage && posts.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {posts.slice(0, 8).map((item) => (
                            <BeritaCianjurCard 
                                key={item.id}
                                berita={item} 
                                baseUrl={baseUrl} 
                            />
                        ))}
                    </div>
                )}

                {/* Action Footer */}
                {!isLoading && !errorMessage && posts.length > 0 && (
                    <div className="mt-12 text-center">
                        <a 
                            href="https://cianjurkab.go.id/berita" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 hover:shadow-md"
                        >
                            Lihat Semua Berita
                            <span className="block transform transition-transform group-hover:translate-x-1">&rarr;</span>
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}
