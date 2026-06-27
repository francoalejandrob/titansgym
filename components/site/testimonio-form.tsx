"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Loader2, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitTestimonio } from "@/lib/actions/testimonios";
import { cn } from "@/lib/utils";

export function TestimonioForm() {
  const [nombre, setNombre] = React.useState("");
  const [texto, setTexto] = React.useState("");
  const [calificacion, setCalificacion] = React.useState(5);
  const [hover, setHover] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !texto.trim()) {
      toast.error("Por favor completa tu nombre y reseña.");
      return;
    }
    setLoading(true);
    try {
      await submitTestimonio({ nombre_cliente: nombre, texto, calificacion });
      setSent(true);
    } catch {
      toast.error("Hubo un error al enviar tu reseña. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center"
      >
        <CheckCircle className="size-12 text-primary" />
        <h3 className="font-heading text-xl font-bold uppercase">
          ¡Gracias por tu reseña!
        </h3>
        <p className="text-sm text-muted-foreground">
          Tu reseña fue recibida y aparecerá en el sitio luego de ser revisada.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Tu nombre</label>
        <Input
          placeholder="Ej: María García"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Calificación</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setCalificacion(star)}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "size-8 transition-colors",
                  (hover || calificacion) >= star
                    ? "fill-primary text-primary"
                    : "text-muted-foreground/40"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Tu reseña</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          required
          placeholder="Cuéntanos tu experiencia en Titan's Gym..."
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full cursor-pointer">
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        Enviar reseña
      </Button>
    </form>
  );
}
