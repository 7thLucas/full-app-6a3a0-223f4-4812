import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { festaApi } from "~/festa/lib/api";
import { cn } from "~/lib/utils";

/**
 * Wraps the @qb/uploader scaffold (/api/uploader/image) to upload property
 * imagery and return the served URL. Supports single or multiple values.
 */
export function ImageUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    const res = await festaApi.uploadImage(file);
    setUploading(false);
    if (res.success && res.data?.url) {
      onChange(res.data.url);
    } else {
      setError(res.message || "Upload failed");
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-20 w-28 overflow-hidden rounded-xl border border-border">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 rounded-full bg-foreground/70 p-1 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-28 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span className="text-[10px]">Upload</span>
              </>
            )}
          </button>
        )}
        <div className="flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste an image URL"
            className="festa-input"
          />
          {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
