"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function ImageUpload({
  value,
  onChange,
  folder,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
}) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona un archivo de imagen válido.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe pesar menos de 5MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        toast.error(`Error al subir: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage.from("site-media").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Imagen subida correctamente");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
          <Image src={value} alt="Imagen" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            className="absolute right-2 top-2 cursor-pointer"
            onClick={() => onChange(null)}
            aria-label="Quitar imagen"
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <ImagePlus className="size-6" />
          )}
          <span className="text-sm">
            {uploading ? "Subiendo..." : "Subir imagen"}
          </span>
        </button>
      )}
    </div>
  );
}
