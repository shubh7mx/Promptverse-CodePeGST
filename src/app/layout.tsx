import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DRISHTI-SWARM | India Natural Disaster Intelligence & Autonomous Swarm Platform",
  description: "Detect, Predict, and Prevent natural disasters across India using space satellite telemetry, physics simulation models, and autonomous AI Swarm agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}>
        <Navbar />
        <main className="w-full flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
