import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SIGMA — Sistem Intelijen Governance & Monitoring Anggaran",
  description:
    "Unified platform combining financial forensics and regulatory intelligence for transparent governance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full bg-slate-50 font-sans text-slate-800">
        {/* Fixed sidebar */}
        <Sidebar />

        {/* Main content area — offset by sidebar width */}
        <main className="ml-72 min-h-screen">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
