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
    "Platform terpadu yang menggabungkan forensik keuangan dan intelijen regulasi untuk tata kelola yang transparan.",
  other: {
    'dicoding:email': "liviajunike1606@gmail.com"
  }
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

        {/* Area konten utama — digeser sesuai lebar sidebar */}
        <main className="ml-72 min-h-screen">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
