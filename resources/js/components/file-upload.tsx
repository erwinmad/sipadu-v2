import { Label } from '@/components/ui/label';
import { Upload, X, AlertCircle, FileCheck } from 'lucide-react';
import { useState } from 'react';

const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

interface FileUploadProps {
    label: string;
    id: string;
    file: File | null;
    onChange: (f: File | null) => void;
    error?: string;
    required?: boolean;
    maxSize?: number; // in bytes, default 2MB
    accept?: string;  // custom accept string
}

export default function FileUpload({
    label,
    id,
    file,
    onChange,
    error,
    required,
    maxSize = MAX_FILE_SIZE,
    accept = 'image/*,.pdf',
}: FileUploadProps) {
    const [validationError, setValidationError] = useState<string | null>(null);

    const validateFile = (selectedFile: File): string | null => {
        // Check MIME type
        const fileType = selectedFile.type.toLowerCase();
        const fileName = selectedFile.name.toLowerCase();
        const fileExt = '.' + fileName.split('.').pop();

        const isAllowedType = ALLOWED_TYPES.includes(fileType);
        const isAllowedExt = ALLOWED_EXTENSIONS.includes(fileExt);

        if (!isAllowedType && !isAllowedExt) {
            return `Format file tidak didukung. Hanya JPG, PNG, WebP, dan PDF yang diperbolehkan.`;
        }

        // Check file size
        if (selectedFile.size > maxSize) {
            return `Ukuran file terlalu besar (${formatFileSize(selectedFile.size)}). Maksimal ${formatFileSize(maxSize)}.`;
        }

        return null;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;

        if (selectedFile) {
            const validationResult = validateFile(selectedFile);
            if (validationResult) {
                setValidationError(validationResult);
                // Reset the input
                e.target.value = '';
                onChange(null);
                return;
            }
        }

        setValidationError(null);
        onChange(selectedFile);
    };

    const handleRemove = () => {
        setValidationError(null);
        onChange(null);
    };

    const displayError = validationError || error;

    return (
        <div className="space-y-1">
            <Label htmlFor={id} className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>

            {!file ? (
                <div className="relative">
                    <input
                        id={id}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        required={required}
                    />
                    <div className={`flex flex-col items-center justify-center rounded-xl border ${displayError ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/20' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'} px-3 py-4 text-center transition-colors peer-hover:border-emerald-500 dark:peer-hover:border-emerald-500 peer-hover:bg-emerald-50 dark:peer-hover:bg-emerald-950/20 peer-focus:border-emerald-500 peer-focus:ring-1 peer-focus:ring-emerald-500`}>
                        <Upload className={`mb-2 h-4 w-4 ${displayError ? 'text-red-400' : 'text-slate-400'}`} />
                        <span className={`text-[10px] ${displayError ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                            PDF / JPG / PNG (Max {formatFileSize(maxSize)})
                        </span>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <FileCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                            <span className="block max-w-[140px] truncate text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                {file.name}
                            </span>
                            <span className="text-[10px] text-emerald-600/60 dark:text-emerald-500/60">
                                {formatFileSize(file.size)}
                            </span>
                        </div>
                    </div>
                    <button type="button" onClick={handleRemove} className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 shrink-0 ml-2">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {displayError && (
                <div className="flex items-start gap-1.5 mt-1">
                    <AlertCircle className="h-3 w-3 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600 dark:text-red-400">{displayError}</p>
                </div>
            )}
        </div>
    );
}
