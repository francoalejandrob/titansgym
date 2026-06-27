"use client";

import { MessageCircle, UserPlus } from "lucide-react";
import Link from "next/link";
import { buildWhatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";

export function MobileCtaBar({ phone }: { phone: string }) {
  const whatsappHref = buildWhatsappLink(phone, defaultWhatsappMessage);

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden">
      {/* subtle top shadow */}
      <div className="h-px bg-border" />
      <div className="flex items-center gap-2 bg-background/95 px-4 py-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Link
          href="/registrate"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold font-heading uppercase tracking-wide text-foreground transition-colors active:bg-accent"
        >
          <UserPlus className="size-4" />
          Regístrate
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold font-heading uppercase tracking-wide text-white transition-colors active:bg-red-600"
        >
          <MessageCircle className="size-4" />
          Únete ahora
        </a>
      </div>
    </div>
  );
}
