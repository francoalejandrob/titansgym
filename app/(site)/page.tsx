import { Hero } from "@/components/site/hero";
import { StatsBar } from "@/components/site/stats-bar";
import { Beneficios } from "@/components/site/beneficios";
import { PromoBanner } from "@/components/site/promo-banner";
import { PlanesPreview } from "@/components/site/planes-preview";
import { GaleriaPreview } from "@/components/site/galeria-preview";
import { ImcCalculator } from "@/components/site/imc-calculator";
import { TestimoniosCarousel } from "@/components/site/testimonios-carousel";
import { Ubicacion } from "@/components/site/ubicacion";
import { ContactoForm } from "@/components/site/contacto-form";
import {
  getConfiguracionSitio,
  getGaleriaActiva,
  getHorarios,
  getMembresiasSitio,
  getPromocionesActivas,
  getTestimoniosActivos,
} from "@/lib/data/queries";

export default async function HomePage() {
  const [config, horarios, promociones, testimonios, galeria, membresias] =
    await Promise.all([
      getConfiguracionSitio(),
      getHorarios(),
      getPromocionesActivas(),
      getTestimoniosActivos(),
      getGaleriaActiva(),
      getMembresiasSitio(),
    ]);

  return (
    <>
      <Hero config={config} />
      <StatsBar />
      <Beneficios />
      {promociones[0] && <PromoBanner promo={promociones[0]} />}
      <PlanesPreview phone={config.telefono_whatsapp} planes={membresias} />
      <GaleriaPreview items={galeria} />
      <ImcCalculator phone={config.telefono_whatsapp} />
      <TestimoniosCarousel items={testimonios} />
      <Ubicacion config={config} horarios={horarios} />
      <ContactoForm config={config} />
    </>
  );
}
