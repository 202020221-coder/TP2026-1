import { useEffect, useRef, useState, type FC } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { resolveServicioFotoUrl, SERVICIO_FOTO_ACCEPT } from "../lib/servicio-foto";

interface Props {
  currentFotoUrl?: string | null;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export const ServicioFotoField: FC<Props> = ({
  currentFotoUrl,
  file,
  onFileChange,
  error,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const existingUrl = currentFotoUrl
    ? resolveServicioFotoUrl(currentFotoUrl)
    : "";

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const displayUrl = previewUrl ?? (file ? null : existingUrl) ?? null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    e.target.value = "";
    onFileChange(selected);
  };

  const clearSelection = () => {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm text-gray-700 font-medium">Foto del servicio</Label>
      <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-3">
        {displayUrl ? (
          <div className="relative mx-auto w-full max-w-[220px]">
            <img
              src={displayUrl}
              alt="Vista previa del servicio"
              className="h-36 w-full rounded-md object-cover border border-border"
            />
            {!disabled && (
              <button
                type="button"
                onClick={clearSelection}
                className="absolute -top-2 -right-2 rounded-full bg-destructive p-1 text-white shadow hover:bg-destructive/90"
                title="Quitar imagen seleccionada"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex h-28 items-center justify-center rounded-md bg-muted/40 text-muted-foreground">
            <ImagePlus className="h-8 w-8 opacity-40" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            {displayUrl ? "Cambiar foto" : "Subir foto"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {file
              ? file.name
              : existingUrl
                ? "Foto actual del servicio"
                : "JPG, PNG, WEBP o GIF — máx. 5 MB"}
          </span>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={SERVICIO_FOTO_ACCEPT}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
