import { BackgroundBeams } from "@/components/ui/background-beams";
import { ImageProvider } from "@/context/ImageContext";
import { StyleProvider } from "@/context/StyleContext";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const animeFont = localFont({
  src: [
    {
      path: "../public/fonts/animeace2_reg.ttf",
      weight: "400",
    },
    {
      path: "../public/fonts/animeace2_ital.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/animeace2_bld.ttf",
      weight: "700",
    },


  ],
  variable: "--font-anime",
});

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--inter" });

export const metadata: Metadata = {
  title: "Anime Me",
  description: "Create anime-style images from your photos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${animeFont.variable} bg-slate-950`}>
        <ImageProvider>
          <StyleProvider>
            {children}
            <BackgroundBeams />

          </StyleProvider>
        </ImageProvider>
      </body>
    </html>
  );
}
