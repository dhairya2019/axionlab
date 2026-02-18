
import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AXIONLAB | Engineering for the obsessed.",
  description: "Independent systems engineering lab designing commerce infrastructure and high-performance applications.",
};

export default function RootLayout({
  children,
}: {
  // Fix: Import React to resolve the React namespace for ReactNode
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-white selection:bg-accent selection:text-white overflow-x-hidden">
        <Nav />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
