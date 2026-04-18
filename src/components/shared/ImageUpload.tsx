import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useLang } from '../../lib/LangContext';
import { t } from '../../lib/i18n';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const { lang } = useLang();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('فقط فایل تصویری مجاز است');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result as string;
        const res = await api.uploadImage(data, file.name);
        onChange(res.url);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-stone-400 mb-1.5">{label}</label>}

      {/* Preview */}
      {value && (
        <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-stone-200">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload area */}
      {!value && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#8B7355] hover:bg-stone-50 transition-all"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin text-[#8B7355]" />
              <span className="text-xs text-stone-400">{t(lang, 'uploading')}</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-stone-400" />
              <span className="text-xs text-stone-500 font-bold">{t(lang, 'uploadImage')}</span>
              <span className="text-[10px] text-stone-400">PNG, JPG, WebP — max 5MB</span>
            </>
          )}
        </div>
      )}

      {/* URL fallback */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-stone-200" />
        <span className="text-[10px] text-stone-400">{t(lang, 'orEnterUrl')}</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>
      <input
        type="url"
        value={value.startsWith('/uploads/') ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-[#1F3D2B] outline-none text-sm"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
