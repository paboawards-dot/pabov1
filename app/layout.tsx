import type { Metadata, Viewport } from "next";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";

export const metadata: Metadata = {
  title: "Pabo awards — Prix de l'art du Bounkani",
  description: "Votez pour vos candidats favoris aux Pabo awards.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-pabo-bg min-h-screen">
        <RegisterServiceWorker />
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
