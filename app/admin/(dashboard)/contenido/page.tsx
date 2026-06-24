import { Clock, Image as ImageIcon, Quote, Mail, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { HorariosManager } from "@/components/admin/horarios-manager";
import { GaleriaManager } from "@/components/admin/galeria-manager";
import { TestimoniosManager } from "@/components/admin/testimonios-manager";
import { MensajesManager } from "@/components/admin/mensajes-manager";
import { SitioConfigManager } from "@/components/admin/sitio-config-manager";
import {
  getAllContacto,
  getAllGaleria,
  getAllHorarios,
  getAllTestimonios,
  getSiteConfig,
} from "@/lib/data/admin-queries";

export default async function AdminContenidoPage() {
  const [horarios, galeria, testimonios, mensajes, config] = await Promise.all([
    getAllHorarios(),
    getAllGaleria(),
    getAllTestimonios(),
    getAllContacto(),
    getSiteConfig(),
  ]);

  const mensajesSinLeer = mensajes.filter((m) => !m.leido).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight">
          Contenido
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra horarios, galería, testimonios, mensajes y la
          configuración general del sitio.
        </p>
      </div>

      <Tabs defaultValue="horarios">
        <TabsList className="h-11 flex-wrap gap-1 rounded-xl p-1.5">
          <TabsTrigger value="horarios" className="h-8 gap-1.5 rounded-lg px-3.5 text-sm">
            <Clock className="size-4" />
            Horarios
          </TabsTrigger>
          <TabsTrigger value="galeria" className="h-8 gap-1.5 rounded-lg px-3.5 text-sm">
            <ImageIcon className="size-4" />
            Galería
          </TabsTrigger>
          <TabsTrigger value="testimonios" className="h-8 gap-1.5 rounded-lg px-3.5 text-sm">
            <Quote className="size-4" />
            Testimonios
          </TabsTrigger>
          <TabsTrigger value="mensajes" className="h-8 gap-1.5 rounded-lg px-3.5 text-sm">
            <Mail className="size-4" />
            Mensajes
            {mensajesSinLeer > 0 && (
              <Badge className="ml-1 h-4 px-1.5 text-[10px]">{mensajesSinLeer}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sitio" className="h-8 gap-1.5 rounded-lg px-3.5 text-sm">
            <Settings className="size-4" />
            Sitio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="horarios" className="mt-6">
          <HorariosManager horarios={horarios} />
        </TabsContent>
        <TabsContent value="galeria" className="mt-6">
          <GaleriaManager items={galeria} />
        </TabsContent>
        <TabsContent value="testimonios" className="mt-6">
          <TestimoniosManager items={testimonios} />
        </TabsContent>
        <TabsContent value="mensajes" className="mt-6">
          <MensajesManager mensajes={mensajes} />
        </TabsContent>
        <TabsContent value="sitio" className="mt-6">
          <SitioConfigManager config={config} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
