import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';

export default function ImageUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      onChange(file_url);
    } catch (err) {
      setError('Görsel yüklenemedi. Tekrar deneyin.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  if (value) {
    return (
      <div className="relative">
        <Image src={value} className="w-full h-40 rounded-xl border border-border object-cover" />
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Görseli kaldır"
          className="absolute top-2 right-2 rounded-full bg-ink text-foreground p-1.5 hover:text-coral transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="w-full h-40 rounded-xl border-2 border-dashed border-border hover:border-mint/60 disabled:opacity-60 flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground hover:text-mint transition-colors"
      >
        {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImagePlus className="w-5 h-5" />}
        {busy ? 'Yükleniyor...' : 'Kapak görseli seç'}
      </button>
      {error && <p className="mt-1 text-xs text-coral">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={pick} />
    </div>
  );
}