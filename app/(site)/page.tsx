import { Hero } from "@/components/site/hero";
import { StatsBar } from "@/components/site/stats-bar";
import { Beneficios } from "@/components/site/beneficios";
import { PromoBanner } from "@/components/site/promo-banner";
import { PlanesPreview } from "@/components/site/planes-preview";
import { GaleriaPreview } from "@/components/site/galeria-preview";
import { ImcCalculator } from "@/components/site/imc-calculator";
import { TestimoniosCarousel } from "@/components/site/testimonios-carousel";
import { TestimonioForm } from "@/components/site/testimonio-form";
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

      {/* Sección para dejar reseña pública */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Tu opinión importa
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            Deja tu reseña
          </h2>
          <p className="mt-3 text-muted-foreground">
            Cuéntanos tu experiencia en Titan&apos;s Gym. Tu reseña aparecerá en el sitio luego de ser revisada.
          </p>
        </div>
        <TestimonioForm />
      </section>

      <Ubicacion config={config} horarios={horarios} />
      <ContactoForm config={config} />
    </>
  );
}
