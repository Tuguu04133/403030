"use client";

import React from "react";
import { useDashboard } from "../context/DashboardContext";
import { CalendarRange } from "lucide-react";

export default function Header() {
  const {
    year,
    setYear,
    semester,
    setSemester
  } = useDashboard();

  return (
    <header className="min-h-16 sm:h-20 bg-white border-b border-card-border px-4 sm:px-8 py-3 flex items-center justify-end sticky top-0 font-sans z-10 shrink-0">
      {/* Filter and Action Controls */}
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
        {/* Year Filter */}
        <div className="flex min-w-0 items-center gap-2 bg-gray-50 border border-card-border rounded-xl px-3 py-2 text-xs text-gray-700">
          <CalendarRange className="w-4 h-4 text-primary-teal" />
          <span className="font-semibold text-[10px] text-gray-400 whitespace-nowrap">Хичээлийн жил:</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-transparent font-semibold border-none text-gray-800 focus:outline-none cursor-pointer text-xs"
          >
            <option value="2026">2026 он</option>
            <option value="2025">2025 он</option>
            <option value="2024">2024 oн</option>
          </select>
        </div>

        {/* Semester Filter */}
        <div className="flex min-w-0 items-center gap-2 bg-gray-50 border border-card-border rounded-xl px-3 py-2 text-xs text-gray-700">
          <span className="font-semibold text-[10px] text-gray-400 whitespace-nowrap">Улирал:</span>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value as "Намар" | "Хавар")}
            className="bg-transparent font-semibold border-none text-gray-800 focus:outline-none cursor-pointer text-xs"
          >
            <option value="Хавар">Хавар</option>
            <option value="Намар">Намар</option>
          </select>
        </div>
      </div>
    </header>
  );
}

