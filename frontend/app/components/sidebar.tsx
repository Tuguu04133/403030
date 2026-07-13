"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserSquare2, Users, Sparkles } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Үндсэн Хяналт", icon: LayoutDashboard },
    { href: "/teachers", label: "Багш", icon: UserSquare2 },
    { href: "/students", label: "Оюутны Дүн & Жагсаалт", icon: Users },
  ];

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-white border-r border-card-border flex-col h-screen sticky top-0 shrink-0 font-sans z-10">
        <div className="h-20 border-b border-card-border px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-teal flex items-center justify-center text-accent-green font-bold text-lg shadow-sm">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-primary-teal text-lg tracking-tight leading-none">GradPulse</span>
              <span className="text-[10px] text-gray-400 font-medium">Аналитикийн систем</span>
            </div>
          </div>
          <div className="w-6 h-6 rounded-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-teal cursor-pointer">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-7 overflow-y-auto">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 block mb-3">Анализ & Үзүүлэлт</span>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                      isActive
                        ? "bg-primary-teal/5 text-primary-teal font-semibold border-l-4 border-primary-teal"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-primary-teal" : "text-gray-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-card-border bg-white/95 backdrop-blur lg:hidden font-sans">
        <div className="grid grid-cols-3 gap-1 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-bold transition-all ${
                  isActive
                    ? "bg-primary-teal text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="max-w-full truncate leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
