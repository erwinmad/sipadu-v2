import { CheckCircle2, Edit, FileText, MapPin, Calendar, User, Hash, Home, Shield } from 'lucide-react';

interface ReviewData {
    [key: string]: any;
}

interface ReviewFieldConfig {
    label: string;
    value: any;
    type?: 'text' | 'date' | 'file';
    icon?: any;
}

interface ReviewSectionProps {
    title: string;
    fields: ReviewFieldConfig[];
    icon?: any;
}

function ReviewSection({ title, fields, icon: Icon }: ReviewSectionProps) {
    return (
        <div className="mb-6">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                {Icon && <Icon className="h-5 w-5 text-emerald-600" />}
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
            </div>
            <div className="space-y-3">
                {fields.map((field, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                        <span className="text-sm font-medium text-slate-600">{field.label}:</span>
                        <span className="text-sm font-bold text-slate-900 text-right max-w-xs">
                            {field.type === 'file' && field.value ? (
                                <span className="text-emerald-600">✓ File terupload</span>
                            ) : field.type === 'date' ? (
                                new Date(field.value).toLocaleDateString('id-ID')
                            ) : (
                                field.value || '-'
                            )}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface ReviewModalProps {
    data: ReviewData;
    layananName: string;
    onConfirm: () => void;
    onEdit: () => void;
    isSubmitting: boolean;
}

export default function ReviewModal({ data, layananName, onConfirm, onEdit, isSubmitting }: ReviewModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-8 py-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">Review Permohonan</h2>
                            <p className="text-sm font-medium text-slate-600">{layananName}</p>
                        </div>
                    </div>
                    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-3">
                        <p className="text-xs font-medium text-blue-900">
                            <strong>Penting:</strong> Pastikan semua data yang Anda masukkan sudah benar sebelum mengirim permohonan.
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6">
                    {/* Dynamic sections based on data */}
                    {renderReviewSections(data)}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-slate-50 px-8 py-6">
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onEdit}
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 disabled:opacity-50"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Data
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {isSubmitting ? 'Mengirim...' : 'Kirim Permohonan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function renderReviewSections(data: ReviewData) {
    const sections = [];

    // Data Wilayah
    if (data.kode_kecamatan || data.kode_desa) {
        sections.push(
            <ReviewSection
                key="wilayah"
                title="Data Wilayah"
                icon={MapPin}
                fields={[
                    { label: 'Kecamatan', value: data.kecamatan_name || data.kode_kecamatan },
                    { label: 'Desa', value: data.desa_name || data.kode_desa },
                ]}
            />
        );
    }

    // Surat Pengantar
    if (data.no_pengantar || data.tgl_pengantar) {
        sections.push(
            <ReviewSection
                key="pengantar"
                title="Surat Pengantar"
                icon={FileText}
                fields={[
                    { label: 'No. Pengantar', value: data.no_pengantar, icon: Hash },
                    { label: 'Tanggal Pengantar', value: data.tgl_pengantar, type: 'date', icon: Calendar },
                ]}
            />
        );
    }

    // Specific data based on form type
    if (data.alamat_domisili) {
        sections.push(
            <ReviewSection
                key="domisili"
                title="Data Domisili"
                icon={Home}
                fields={[
                    { label: 'Alamat Domisili', value: data.alamat_domisili },
                ]}
            />
        );
    }

    if (data.tujuan || data.peruntukan) {
        sections.push(
            <ReviewSection
                key="sktm"
                title="Data SKTM"
                icon={FileText}
                fields={[
                    { label: 'Tujuan/Peruntukan', value: data.tujuan || data.peruntukan },
                    ...(data.penghasilan ? [{ label: 'Penghasilan', value: data.penghasilan }] : []),
                    ...(data.tanggungan ? [{ label: 'Tanggungan', value: data.tanggungan }] : []),
                ]}
            />
        );
    }

    if (data.jenis_usaha) {
        sections.push(
            <ReviewSection
                key="usaha"
                title="Data Usaha"
                icon={FileText}
                fields={[
                    { label: 'Jenis Usaha', value: data.jenis_usaha },
                    { label: 'Kegiatan Usaha', value: data.kegiatan_usaha },
                    { label: 'Nama Perusahaan', value: data.nama_perusahaan },
                    { label: 'Pemilik Usaha', value: data.pemilik_usaha },
                    { label: 'Alamat Usaha', value: data.alamat_usaha },
                ]}
            />
        );
    }

    // Dokumen
    const dokumenFields = [];
    if (data.ktp) dokumenFields.push({ label: 'KTP', value: data.ktp, type: 'file' as const });
    if (data.kk) dokumenFields.push({ label: 'Kartu Keluarga', value: data.kk, type: 'file' as const });
    if (data.pengantar) dokumenFields.push({ label: 'Surat Pengantar', value: data.pengantar, type: 'file' as const });
    if (data.ktp_pria) dokumenFields.push({ label: 'KTP Pria', value: data.ktp_pria, type: 'file' as const });
    if (data.ktp_wanita) dokumenFields.push({ label: 'KTP Wanita', value: data.ktp_wanita, type: 'file' as const });
    if (data.bukti_pendaftaran) dokumenFields.push({ label: 'Bukti Pendaftaran', value: data.bukti_pendaftaran, type: 'file' as const });
    if (data.sku) dokumenFields.push({ label: 'SKU', value: data.sku, type: 'file' as const });
    if (data.pernyataan) dokumenFields.push({ label: 'Surat Pernyataan', value: data.pernyataan, type: 'file' as const });

    if (dokumenFields.length > 0) {
        sections.push(
            <ReviewSection
                key="dokumen"
                title="Dokumen Pendukung"
                icon={Shield}
                fields={dokumenFields}
            />
        );
    }

    return sections;
}
