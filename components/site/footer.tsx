import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/icons/social";
import { diaLabel } from "@/lib/data/site-config";
import { buildWhatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";
import type { ConfiguracionSitio, Horario } from "@/lib/types/database";

export function Footer({
  config,
  horarios,
}: {
  config: ConfiguracionSitio;
  horarios: Horario[];
}) {
  const year = new Date().getFullYear();
  const whatsappHref = buildWhatsappLink(config.telefono_whatsapp, defaultWhatsappMessage);

  return (
    <footer className="border-t border-border bg-card/40 pb-[80px] sm:pb-0">
      {/* Mobile footer: compact */}
      <div className="sm:hidden px-5 py-10 space-y-8">
        {/* Brand */}
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <Image
              src="/images/brand/logo.jpg"
              alt="Titan's Gym"
              width={36}
              height={36}
              className="size-9 rounded-full object-cover ring-1 ring-border"
            />
            <span className="font-heading text-lg font-extrabold tracking-wide">
              TITAN&apos;S <span className="text-primary">GYM</span>
            </span>
          </Link>
          <div className="flex gap-3">
            {config.instagram_url && (
              <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <InstagramIcon className="size-4" />
              </a>
            )}
            {config.facebook_url && (
              <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <FacebookIcon className="size-4" />
              </a>
            )}
          </div>
        </div>

        {/* Quick contact */}
        <div className="space-y-2.5 text-sm text-muted-foreground">
          <a href={`tel:${config.telefono_whatsapp}`}
            className="flex items-center gap-2 hover:text-foreground transition-colors">
            <Phone className="size-4 text-primary shrink-0" />
            {config.telefono_whatsapp}
          </a>
          <a href={`mailto:${config.email_contacto}`}
            className="flex items-center gap-2 hover:text-foreground transition-colors break-all">
            <Mail className="size-4 text-primary shrink-0" />
            {config.email_contacto}
          </a>
          <p className="flex items-start gap-2">
            <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
            <span>{config.direccion}, {config.ciudad}</span>
          </p>
        </div>

        {/* Quick links in 2 cols */}
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          {[
            { href: "/planes", label: "Planes" },
            { href: "/galeria", label: "Galería" },
            { href: "/registrate", label: "Regístrate" },
            { href: "/#contacto", label: "Contacto" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary transition-colors cursor-pointer">
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop footer: 4-col grid */}
      <div className="hidden sm:grid mx-auto max-w-7xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            <Image src="/images/brand/logo.jpg" alt="Titan's Gym" width={40} height={40}
              className="size-10 rounded-full object-cover ring-1 ring-border" />
            <span className="font-heading text-xl font-extrabold tracking-wide">
              TITAN&apos;S <span className="text-primary">GYM</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">{config.hero_subtitulo}</p>
          <div className="flex gap-3 pt-1">
            {config.instagram_url && (
              <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Titan's Gym"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <InstagramIcon className="size-4" />
              </a>
            )}
            {config.facebook_url && (
              <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook de Titan's Gym"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                <FacebookIcon className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">ENLACES</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              { href: "/planes", label: "Planes y Membresías" },
              { href: "/galeria", label: "Galería" },
              { href: "/registrate", label: "Regístrate" },
              { href: "/#testimonios", label: "Testimonios" },
              { href: "/#ubicacion", label: "Ubicación" },
              { href: "/#contacto", label: "Contacto" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="cursor-pointer transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">CONTACTO</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{config.direccion}<br />{config.ciudad}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href={`tel:${config.telefono_whatsapp}`} className="cursor-pointer transition-colors hover:text-primary">
                {config.telefono_whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" />
              <a href={`mailto:${config.email_contacto}`} className="cursor-pointer break-all transition-colors hover:text-primary">
                {config.email_contacto}
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-heading text-sm font-bold tracking-wider text-foreground">HORARIOS</h3>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {horarios.map((h) => (
              <li key={h.id} className="flex justify-between gap-4">
                <span>{diaLabel[h.dia]}</span>
                <span className="text-foreground/80">
                  {h.cerrado ? "Cerrado" : `${h.abre} – ${h.cierra}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} Titan&apos;s Gym. Todos los derechos reservados.</p>
          <p className="hidden sm:block">Entrena con constancia. Vive como un titán.</p>
        </div>
      </div>
    </footer>
  );
}
