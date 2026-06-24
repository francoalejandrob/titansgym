import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const barlow = Barlow({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Titan's Gym | Gimnasio en La Libertad, Santa Elena",
    template: "%s | Titan's Gym",
  },
  description:
    "Titan's Gym: gimnasio premium en La Libertad, Santa Elena. Membresías flexibles, clases de Taekwondo, Titan Dance y Titan Power. Entrena con constancia, vive como un titán.",
  keywords: [
    "gimnasio La Libertad",
    "gimnasio Santa Elena",
    "Titan's Gym",
    "membresías gimnasio Ecuador",
    "clases de Taekwondo",
    "gimnasio Ecuador",
    "entrenamiento de fuerza",
  ],
  authors: [{ name: "Titan's Gym" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: siteUrl,
    siteName: "Titan's Gym",
    title: "Titan's Gym | Gimnasio en La Libertad, Santa Elena",
    description:
      "Membresías flexibles, clases de Taekwondo, Titan Dance y Titan Power. Entrena con constancia, vive como un titán.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Titan's Gym | Gimnasio en La Libertad, Santa Elena",
    description:
      "Membresías flexibles, clases de Taekwondo, Titan Dance y Titan Power. Entrena con constancia, vive como un titán.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/brand/logo.jpg",
    apple: "/images/brand/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${barlowCondensed.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
