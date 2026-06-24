"use client";

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { actualizarConfiguracionSitio } from "@/lib/actions/admin/contenido";
import type { ConfiguracionSitio } from "@/lib/types/database";

export function SitioConfigManager({ config }: { config: ConfiguracionSitio }) {
  const [form, setForm] = React.useState(config);
  const [pending, startTransition] = React.useTransition();

  function set<K extends keyof ConfiguracionSitio>(key: K, value: ConfiguracionSitio[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    startTransition(async () => {
      const result = await actualizarConfiguracionSitio({
        nombre_gym: form.nombre_gym,
        telefono_whatsapp: form.telefono_whatsapp,
        email_contacto: form.email_contacto,
        direccion: form.direccion,
        ciudad: form.ciudad,
        google_maps_url: form.google_maps_url,
        latitud: form.latitud,
        longitud: form.longitud,
        instagram_url: form.instagram_url,
        facebook_url: form.facebook_url,
        tiktok_url: form.tiktok_url,
        hero_titulo: form.hero_titulo,
        hero_subtitulo: form.hero_subtitulo,
      });
      if (result.success) {
        toast.success("Configuración actualizada");
      } else {
        toast.error(result.error ?? "Error al guardar");
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-8">
      <section className="space-y-4">
        <h3 className="font-heading text-lg font-bold uppercase tracking-tight">
          Hero / Página principal
        </h3>
        <div className="space-y-1.5">
          <Label>Título del hero</Label>
          <Input
            value={form.hero_titulo}
            onChange={(e) => set("hero_titulo", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Subtítulo del hero</Label>
          <Textarea
            value={form.hero_subtitulo}
            onChange={(e) => set("hero_subtitulo", e.target.value)}
            rows={2}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-heading text-lg font-bold uppercase tracking-tight">Contacto</h3>
        <div className="space-y-1.5">
          <Label>WhatsApp (con código de país)</Label>
          <Input
            value={form.telefono_whatsapp}
            onChange={(e) => set("telefono_whatsapp", e.target.value)}
            placeholder="+593963662370"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Email de contacto</Label>
          <Input
            type="email"
            value={form.email_contacto}
            onChange={(e) => set("email_contacto", e.target.value)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-heading text-lg font-bold uppercase tracking-tight">Ubicación</h3>
        <div className="space-y-1.5">
          <Label>Dirección</Label>
          <Input value={form.direccion} onChange={(e) => set("direccion", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Ciudad</Label>
          <Input value={form.ciudad} onChange={(e) => set("ciudad", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Link de Google Maps</Label>
          <Input
            value={form.google_maps_url ?? ""}
            onChange={(e) => set("google_maps_url", e.target.value || null)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Latitud</Label>
            <Input
              type="number"
              step="any"
              value={form.latitud ?? ""}
              onChange={(e) => set("latitud", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Longitud</Label>
            <Input
              type="number"
              step="any"
              value={form.longitud ?? ""}
              onChange={(e) => set("longitud", e.target.value ? Number(e.target.value) : null)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-heading text-lg font-bold uppercase tracking-tight">Redes sociales</h3>
        <div className="space-y-1.5">
          <Label>Instagram</Label>
          <Input
            value={form.instagram_url ?? ""}
            onChange={(e) => set("instagram_url", e.target.value || null)}
            placeholder="https://instagram.com/titansgymec"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Facebook</Label>
          <Input
            value={form.facebook_url ?? ""}
            onChange={(e) => set("facebook_url", e.target.value || null)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>TikTok</Label>
          <Input
            value={form.tiktok_url ?? ""}
            onChange={(e) => set("tiktok_url", e.target.value || null)}
          />
        </div>
      </section>

      <Button onClick={handleSave} disabled={pending} className="cursor-pointer">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Guardar cambios
      </Button>
    </div>
  );
}
