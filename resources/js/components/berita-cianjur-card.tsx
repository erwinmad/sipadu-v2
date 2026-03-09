import { Calendar, Tag } from 'lucide-react';

interface Post {
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

interface BeritaCianjurCardProps {
    berita: Post;
    baseUrl: string;
}

export default function BeritaCianjurCard({ berita, baseUrl }: BeritaCianjurCardProps) {
    const defaultImage = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
    
    // Get thumbnail image
    let imageUrl = defaultImage;
    if (berita?.thumbnail && berita.thumbnail.length > 0) {
        const thumb = berita.thumbnail[0];
        if (thumb.formats?.small?.url) {
            imageUrl = baseUrl + thumb.formats.small.url;
        } else if (thumb.formats?.thumbnail?.url) {
            imageUrl = baseUrl + thumb.formats.thumbnail.url;
        } else if (thumb.url) {
            imageUrl = baseUrl + thumb.url;
        }
    } else if (berita?.Gambar && berita.Gambar.length > 0) {
        // Fallback to Gambar
        const img = berita.Gambar[0];
        if (img.formats?.small?.url) {
            imageUrl = baseUrl + img.formats.small.url;
        } else if (img.url) {
            imageUrl = baseUrl + img.url;
        }
    }

    // Determine target URL for news detail
    const detailUrl = berita.slug ? `https://cianjurkab.go.id/berita/${berita.slug}` : `https://cianjurkab.go.id/berita/${berita.id}`;

    // Get date
    const dateStr = berita.tgl_tayang || berita.publishedAt || berita.createdAt || '';
    const formattedDate = dateStr 
        ? new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';
        
    // Get primary category if any
    const categoryName = berita?.categories && berita.categories.length > 0 ? berita.categories[0].Name : 'Berita';

    // Strip HTML from description and truncate
    const stripHtml = (html: string | undefined): string => {
        if (!html) return '';
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };
    
    const plainDesc = stripHtml(berita.DeskripsiBaru);
    const shortDesc = plainDesc.length > 100 ? plainDesc.substring(0, 100) + '...' : plainDesc;

    return (
        <a 
            href={detailUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex h-[320px] w-full flex-col overflow-hidden rounded-2xl bg-slate-900 transition-all hover:scale-[1.02] hover:shadow-xl"
        >
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <img 
                    src={imageUrl} 
                    alt={berita.Title || 'Berita Thumbnail'} 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    width="400"
                    height="320"
                    onError={(e) => {
                        e.currentTarget.src = defaultImage;
                    }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/50 to-transparent"></div>
            </div>

            {/* Category Tag (Top Right) */}
            <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-600/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                <Tag className="h-3 w-3" />
                {categoryName}
            </div>
            
            {/* Content (Bottom) */}
            <div className="relative z-10 mt-auto flex flex-col p-5">
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formattedDate}</span>
                </div>
                
                <h3 className="line-clamp-3 text-lg font-bold leading-tight text-white group-hover:text-emerald-400 transition-colors">
                    {berita.Title}
                </h3>
                
                <div className="mt-4 flex items-center text-[11px] font-bold text-emerald-400 opacity-0 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100">
                    <span>Baca Selengkapnya</span>
                    <span className="ml-1 inline-block transform transition-transform group-hover:translate-x-1">&rarr;</span>
                </div>
            </div>
        </a>
    );
}
