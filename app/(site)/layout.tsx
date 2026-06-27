import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { WhatsappFloatButton } from "@/components/site/whatsapp-float-button";
import { MobileCtaBar } from "@/components/site/mobile-cta-bar";
import { VisitTracker } from "@/components/site/visit-tracker";
import { getConfiguracionSitio, getHorarios } from "@/lib/data/queries";
import { buildGymStructuredData } from "@/lib/seo/structured-data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, horarios] = await Promise.all([
    getConfiguracionSitio(),
    getHorarios(),
  ]);

  const structuredData = buildGymStructuredData(config, horarios);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <VisitTracker />
      <Navbar config={config} />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer config={config} horarios={horarios} />
      <WhatsappFloatButton phone={config.telefono_whatsapp} />
      <MobileCtaBar phone={config.telefono_whatsapp} />
    </>
  );
}
