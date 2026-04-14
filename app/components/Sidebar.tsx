"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Landmark,
  BookOpenText,
  GitCompareArrows,
  Users,
  ShieldCheck,
  ChevronRight,
  Cloud,
} from "lucide-react";

const navItems = [
  {
    label: "Dasbor & Intelijen",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Ringkasan & Analitik",
  },
  {
    label: "Intelijen Keuangan",
    href: "/intelijen-keuangan",
    icon: Landmark,
    description: "Forensik APBD",
  },
  {
    label: "Intelijen Regulasi",
    href: "/intelijen-regulasi",
    icon: BookOpenText,
    description: "Genom Regulasi",
  },
  {
    label: "Mesin Cek-Silang",
    href: "/cek-silang",
    icon: GitCompareArrows,
    description: "Hub Sinergi",
  },
  {
    label: "Partisipasi Warga",
    href: "/partisipasi-warga",
    icon: Users,
    description: "Keterlibatan Publik",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white shadow-sm">
      {/* ── Brand header ──────────────────────────────── */}
      <div className="flex flex-col gap-1 border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-200">
            <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">
              SIGMA
            </h1>
            <p className="text-[11px] font-medium leading-tight text-slate-400">
              Sistem Intelijen Governance
              <br />& Monitoring Anggaran
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Modul Utama
        </p>

        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    group relative flex items-center gap-3 rounded-xl px-3 py-2.5
                    transition-all duration-200 ease-in-out
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-600" />
                  )}

                  <div
                    className={`
                      flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                      transition-colors duration-200
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                      }
                    `}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <span
                      className={`text-sm font-semibold leading-tight ${
                        isActive ? "text-blue-700" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`text-[11px] leading-tight ${
                        isActive ? "text-blue-500" : "text-slate-400"
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>

                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-transform duration-200
                      ${
                        isActive
                          ? "text-blue-400"
                          : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-400"
                      }
                    `}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer ────────────────────────────────────── */}
      <div className="border-t border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
          <Cloud className="h-4 w-4 text-blue-500" />
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-600">
              Didukung oleh Microsoft Azure
            </span>
            <span className="text-[10px] text-slate-400">
              Infrastruktur Cloud
            </span>
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-400">
          © 2026 Platform SIGMA · v0.1.0
        </p>
      </div>
    </aside>
  );
}
