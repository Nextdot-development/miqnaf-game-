import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Save the Patient | MIQNAF",
  description: "Interactive clinical decision-making game for the NAPCON Kolkata 2026 kiosk.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#28397F",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/web/AcuminVariableConcept.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/web/HelveticaNeue-Bold.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
