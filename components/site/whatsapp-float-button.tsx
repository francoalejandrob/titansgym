"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { buildWhatsappLink, defaultWhatsappMessage } from "@/lib/whatsapp";

export function WhatsappFloatButton({ phone }: { phone: string }) {
  const href = buildWhatsappLink(phone, defaultWhatsappMessage);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-5 right-5 z-50 flex size-14 cursor-pointer items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 sm:bottom-6 sm:right-6"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/50 [animation-duration:2.5s]" />
      <MessageCircle className="size-7" fill="white" strokeWidth={0} />
    </motion.a>
  );
}
