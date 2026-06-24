"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Send, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { contactoSchema, type ContactoFormValues } from "@/lib/validations/contacto";
import { enviarContacto } from "@/lib/actions/contacto";
import type { ConfiguracionSitio } from "@/lib/types/database";

export function ContactoForm({ config }: { config: ConfiguracionSitio }) {
  const [sent, setSent] = React.useState(false);
  const form = useForm<ContactoFormValues>({
    resolver: zodResolver(contactoSchema),
    defaultValues: { nombre: "", telefono: "", email: "", mensaje: "" },
  });

  async function onSubmit(values: ContactoFormValues) {
    const result = await enviarContacto(values);
    if (result.success) {
      setSent(true);
      form.reset();
      toast.success("¡Mensaje enviado! Te contactaremos pronto.");
    } else {
      toast.error(result.error ?? "Algo salió mal. Inténtalo de nuevo.");
    }
  }

  return (
    <section id="contacto" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Contáctanos
        </span>
        <h2 className="mt-3 font-heading text-4xl font-extrabold uppercase tracking-tight sm:text-5xl">
          Escríbenos
        </h2>
        <p className="mt-4 text-muted-foreground">
          Resolvemos tus dudas sobre planes, clases y horarios. Respondemos a
          la brevedad.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
            <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Teléfono / WhatsApp</p>
              <p className="text-sm text-muted-foreground">
                {config.telefono_whatsapp}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
            <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Email</p>
              <p className="break-all text-sm text-muted-foreground">
                {config.email_contacto}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
            <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Dirección</p>
              <p className="text-sm text-muted-foreground">
                {config.direccion}, {config.ciudad}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-7 lg:col-span-3">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center"
            >
              <CheckCircle2 className="size-12 text-success" />
              <p className="font-heading text-xl font-bold uppercase tracking-tight">
                ¡Mensaje enviado!
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Gracias por escribirnos. Nuestro equipo te contactará muy
                pronto.
              </p>
              <Button
                variant="secondary"
                className="mt-2 cursor-pointer"
                onClick={() => setSent(false)}
              >
                Enviar otro mensaje
              </Button>
            </motion.div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+593 9XX XXX XXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mensaje"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensaje</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Cuéntanos qué necesitas..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="w-full cursor-pointer"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Enviar mensaje
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </section>
  );
}
