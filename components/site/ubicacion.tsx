import { MapPin, Navigation, Clock } from "lucide-react";

const fmt = (t: string) => t.slice(0, 5);
import { Button } from "@/components/ui/button";
import { diaLabel } from "@/lib/data/site-config";
import type { ConfiguracionSitio, Horario } from "@/lib/types/database";

export function Ubicacion({
  config,
  horarios,
}: {
  config: ConfiguracionSitio;
  horarios: Horario[];
}) {
  const mapEmbedSrc =
    config.latitud && config.longitud
      ? `https://www.google.com/maps?q=${config.latitud},${config.longitud}&z=16&output=embed`
      : null;

  return (
    <section
      id="ubicacion"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14 sm:py-24"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Encuéntranos
        </span>
        <h2 className="mt-3 font-heading text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Ubicación y horarios
        </h2>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-5">
        <div className="overflow-hidden rounded-xl border border-border lg:col-span-3">
          {mapEmbedSrc ? (
            <iframe
              src={mapEmbedSrc}
              title="Ubicación de Titan's Gym"
              className="h-[260px] w-full sm:h-[360px] lg:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-[360px] items-center justify-center bg-card text-muted-foreground">
              Mapa no disponible
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-heading text-lg font-bold uppercase tracking-tight">
                  Dirección
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {config.direccion}
                  <br />
                  {config.ciudad}
                </p>
              </div>
            </div>
            {config.google_maps_url && (
              <Button
                render={
                  <a
                    href={config.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
                className="mt-5 w-full cursor-pointer"
              >
                <Navigation className="size-4" />
                Cómo llegar
              </Button>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 sm:p-7">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
              <h3 className="font-heading text-lg font-bold uppercase tracking-tight">
                Horario de atención
              </h3>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {horarios.map((h) => (
                <li
                  key={h.id}
                  className="flex justify-between border-b border-border/60 py-1.5 last:border-0"
                >
                  <span className="text-muted-foreground">{diaLabel[h.dia]}</span>
                  <span className="font-medium">
                    {h.cerrado ? "Cerrado" : `${fmt(h.abre!)} – ${fmt(h.cierra!)}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
