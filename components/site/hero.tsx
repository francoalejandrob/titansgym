"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, ArrowRight, ArrowUpRight } from "lucide-react";
import { buildWhatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";
import type { ConfiguracionSitio } from "@/lib/types/database";

export function Hero({ config }: { config: ConfiguracionSitio }) {
  const reduced = useReducedMotion();
  const whatsappHref = buildWhatsappLink(config.telefono_whatsapp, defaultWhatsappMessage);

  return (
    <div className="w-full min-h-[100dvh] flex items-start justify-center p-3 md:p-5 bg-background">
      <section className="relative w-full max-w-[1536px] h-[calc(100dvh-24px)] md:h-[calc(100dvh-40px)] rounded-[1.5rem] md:rounded-[3rem] overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/brand/banner1.png"
          alt="Titan's Gym"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Gradient: opaco en top-left donde está el texto, se desvanece hacia el centro-bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black/10 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent z-[1]" />

        {/* Content layer */}
        <div className="relative z-10 w-full h-full flex flex-col">

          {/* Texto anclado arriba-izquierda, bajo la navbar */}
          <div className="flex flex-col pt-28 md:pt-32 lg:pt-36 px-8 md:px-12 lg:px-16 max-w-xl lg:max-w-2xl">

            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-[clamp(2.4rem,6.5vw,5.5rem)] font-black leading-[0.92] uppercase tracking-tight text-white"
            >
              {config.hero_titulo}
            </motion.h1>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-5 text-sm md:text-base text-white/65 leading-relaxed max-w-xs md:max-w-sm"
            >
              {config.hero_subtitulo}
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <motion.a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={reduced ? {} : { scale: 1.03 }}
                whileTap={reduced ? {} : { scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 h-11 text-sm font-bold font-heading uppercase tracking-wide hover:bg-red-500 transition-colors cursor-pointer"
              >
                <MessageCircle className="size-4" />
                Únete por WhatsApp
              </motion.a>

              <motion.div
                whileHover={reduced ? {} : { scale: 1.03 }}
                whileTap={reduced ? {} : { scale: 0.97 }}
              >
                <Link
                  href="/planes"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full px-6 h-11 text-sm font-bold font-heading uppercase tracking-wide hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Ver Planes
                  <ArrowRight className="size-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* BottomRightCorner — faux-cutout */}
          <motion.div
            initial={reduced ? false : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-0 right-0 p-3 pt-5 pl-8 sm:p-4 sm:pt-6 sm:pl-10 md:p-6 md:pt-8 md:pl-14 bg-background rounded-tl-[1.5rem] sm:rounded-tl-[2rem] md:rounded-tl-[3.5rem] flex items-center gap-3 sm:gap-4 md:gap-6"
          >
            {/* Top corner mask */}
            <div className="absolute -top-[1.5rem] sm:-top-[2rem] md:-top-[3.5rem] right-0 w-[1.5rem] sm:w-[2rem] md:w-[3.5rem] h-[1.5rem] sm:h-[2rem] md:h-[3.5rem] pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M56 56V0C56 30.9279 30.9279 56 0 56H56Z" fill="#0A0A0A" />
              </svg>
            </div>
            {/* Left corner mask */}
            <div className="absolute bottom-0 -left-[1.5rem] sm:-left-[2rem] md:-left-[3.5rem] w-[1.5rem] sm:w-[2rem] md:w-[3.5rem] h-[1.5rem] sm:h-[2rem] md:h-[3.5rem] pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M56 56H0C30.9279 56 56 30.9279 56 0V56Z" fill="#0A0A0A" />
              </svg>
            </div>
            <div className="bg-primary/10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-primary/20 shrink-0">
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm md:text-xl font-black font-heading uppercase text-foreground tracking-tight">Ver Planes</span>
              <Link
                href="/planes"
                className="flex items-center gap-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              >
                <span className="text-xs md:text-sm font-medium">Membresías desde $20</span>
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
