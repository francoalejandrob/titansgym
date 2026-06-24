"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, MessageCircle, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { buildWhatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";
import type { ConfiguracionSitio } from "@/lib/types/database";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/planes", label: "Planes" },
  { href: "/galeria", label: "Galería" },
  { href: "/#testimonios", label: "Testimonios" },
  { href: "/#ubicacion", label: "Ubicación" },
  { href: "/#contacto", label: "Contacto" },
];

export function Navbar({ config }: { config: ConfiguracionSitio }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsappHref = buildWhatsappLink(
    config.telefono_whatsapp,
    defaultWhatsappMessage
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-xl border border-border/60 bg-background/80 px-4 py-2.5 backdrop-blur-md transition-shadow",
          scrolled && "shadow-lg shadow-black/40"
        )}
      >
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
          <Image
            src="/images/brand/logo.jpg"
            alt="Titan's Gym"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover ring-1 ring-border"
            priority
          />
          <span className="font-heading text-xl font-extrabold tracking-wide text-foreground">
            TITAN&apos;S <span className="text-primary">GYM</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("#")[0]) &&
                  link.href.split("#")[0] !== "/";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            render={<Link href="/#imc" />}
            nativeButton={false}
            variant="secondary"
            size="sm"
            className="cursor-pointer"
          >
            <Calculator className="size-4" />
            Calcula tu IMC
          </Button>
          <Button
            render={
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" />
            }
            nativeButton={false}
            size="sm"
            className="cursor-pointer"
          >
            <MessageCircle className="size-4" />
            Únete ahora
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer lg:hidden"
                aria-label="Abrir menú"
              />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="font-heading text-lg">
                TITAN&apos;S <span className="text-primary">GYM</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <SheetClose
                  key={link.href}
                  render={
                    <Link
                      href={link.href}
                      className="cursor-pointer rounded-md px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-accent"
                    />
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
              <SheetClose
                render={
                  <Link
                    href="/#imc"
                    className="cursor-pointer rounded-md px-3 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-accent"
                  />
                }
              >
                Calcula tu IMC
              </SheetClose>
            </nav>
            <div className="mt-4 px-4">
              <Button
                render={
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" />
                }
                nativeButton={false}
                className="w-full cursor-pointer"
              >
                <MessageCircle className="size-4" />
                Únete por WhatsApp
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
