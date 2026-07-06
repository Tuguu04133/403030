"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UserSquare2, 
  Users, 
  HelpCircle, 
  Award,
  Sparkles,
  Info,
  ChevronDown
} from "lucide-react";

export default function Sidebar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Үндсэн Хяналт", icon: LayoutDashboard },
    { href: "/teachers", label: "Багш", icon: UserSquare2 },
    { href: "/students", label: "Оюутны Дүн & Жагсаалт", icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-card-border flex flex-col h-screen sticky top-0 shrink-0 font-sans z-10">
      {/* Logo Area */}
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

      {/* Navigation Links */}
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

        {/* <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 block mb-3">Холбоосууд</span>
          <nav className="space-y-1">
            <a 
              href="#help" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
              onClick={(e) => { e.preventDefault(); alert("Графикийн багана дээр дарж оюутныг шүүх, багшийн нэр дээр дарж дэлгэрэнгүйг харах боломжтой."); }}
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              Тусламж & Заавар
            </a>
            <a 
              href="#about" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
              onClick={(e) => { e.preventDefault(); alert("GradPulse Thesis Analytics v1.0. Сургуулийн төгсөлтийн ажил хамгаалалтын комиссын дүнгийн аналитик."); }}
            >
              <Info className="w-4 h-4 text-gray-400" />
              Системийн тухай
            </a>
          </nav>
        </div> */}
      </div>

      {/* Pro Mode & User Card Area */}
      <div className="p-4 border-t border-card-border space-y-4">
        <div className="relative">
          {/* <div 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-card-border"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary-teal flex items-center justify-center text-white font-bold text-sm">
                АШ
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-800 leading-tight">Админ Шүүгч</span>
                <span className="text-[10px] text-gray-400 font-medium">admin@university.edu</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </div> */}

          {/* {profileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-card-border rounded-xl shadow-lg p-3 z-20 text-xs text-gray-600 animate-fadeIn">
              <div className="font-semibold text-gray-800 mb-1">Төгсөлтийн ажил хамгаалалт</div>
              <p className="text-[10px] text-gray-400 mb-2">Хянах багшийн эрх</p>
              <div className="border-t border-gray-100 pt-2 space-y-1.5">
                <div className="flex justify-between">
                  <span>Онооны хувилбар:</span>
                  <span className="font-bold text-primary-teal">v2026.1</span>
                </div>
                <div className="flex justify-between">
                  <span>Идэвхтэй жил:</span>
                  <span className="font-bold text-accent-green">2026</span>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </aside>
  );
}
