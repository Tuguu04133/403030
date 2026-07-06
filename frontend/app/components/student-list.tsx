"use client";

import React from "react";
import { Student } from "../utils/mockData";
import { Users, FileText, ChevronRight, UserCircle, ChevronLeft } from "lucide-react";

interface StudentListProps {
  students: Student[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  totalElements: number;
  levelFilter: string;
  setLevelFilter: (level: string) => void;
  onSelectStudent: (student: Student) => void;
}

export default function StudentList({
  students,
  loading,
  page,
  setPage,
  totalPages,
  totalElements,
  levelFilter,
  setLevelFilter,
  onSelectStudent
}: StudentListProps) {
  // Helper to determine badge colors based on grade score
  const getLevelBadgeStyles = (score: number) => {
    if (score >= 90) return "bg-accent-green/10 text-accent-green-light border border-accent-green/20";
    if (score >= 70) return "bg-primary-teal/5 text-primary-teal-light border border-primary-teal/10";
    return "bg-red-50 text-red-500 border border-red-100";
  };

  const getLevelLabel = (score: number) => {
    if (score >= 90) return "Маш сайн (Excellent)";
    if (score >= 70) return "Дундаж (Average)";
    return "Сул (Weak)";
  };

  // Generate page bubbles array (e.g. [1, 2, 3])
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="bg-white rounded-2xl border border-card-border shadow-sm flex flex-col font-sans h-full relative overflow-hidden">
      {/* Loading Overlay spinner */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-20 animate-fadeIn">
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 border-4 border-primary-teal border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] text-primary-teal font-bold uppercase tracking-wider">Шинэчилж байна...</span>
          </div>
        </div>
      )}

      {/* Header with filters */}
      <div className="p-6 border-b border-card-border flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-primary-teal" />
          <div>
            <h3 className="text-sm font-bold text-gray-800">Оюутны Жагсаалт & Нарийвчилсан Хайлт</h3>
            <p className="text-xs text-gray-400">Хайлт болон дүнгийн түвшнээр ангилах хэсэг</p>
          </div>
        </div>

        {/* Level Filter tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 border border-card-border p-1 rounded-xl text-xs font-semibold self-start md:self-auto">
          {[
            { id: "ALL", label: "Бүгд" },
            { id: "Excellent", label: "Маш сайн" },
            { id: "Average", label: "Дундаж" },
            { id: "Weak", label: "Сул" }
          ].map((tab) => {
            const isActive = levelFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setLevelFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary-teal text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-white"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-x-auto min-h-[350px] max-h-[500px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-card-border bg-gray-50/50 select-none uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10">
              <th className="py-3 px-6">Оюутан</th>
              <th className="py-3 px-4">Сэдвийн Чиглэл</th>
              <th className="py-3 px-4">Анги</th>
              <th className="py-3 px-4 text-right">Комисс</th>
              <th className="py-3 px-6 text-right">Хамгаалалтын Оноо</th>
              <th className="py-3 px-4">Түвшин</th>
              <th className="py-3 px-6 text-center">Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => {
              const score = student.totalScore || student.totalGrade || 0;
              const badgeColor = getLevelBadgeStyles(score);

              // Setup Topic tags colors
              let topicColor = "";
              if (student.topic === "AI") topicColor = "bg-violet-50 text-violet-600";
              else if (student.topic === "AppDev") topicColor = "bg-blue-50 text-blue-600";
              else if (student.topic === "Game") topicColor = "bg-amber-50 text-amber-600";
              else topicColor = "bg-emerald-50 text-emerald-600";

              return (
                <tr
                  key={student.id}
                  onClick={() => onSelectStudent(student)}
                  className="hover:bg-gray-50/80 cursor-pointer transition-all duration-150 group border-b border-gray-100/50"
                >
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-teal/5 flex items-center justify-center text-primary-teal font-semibold text-xs border border-primary-teal/10 shrink-0">
                      <UserCircle className="w-4 h-4 text-primary-teal" />
                    </div>
                    <div className="flex flex-col max-w-xs md:max-w-sm text-left">
                      <span className="font-bold text-gray-800 group-hover:text-primary-teal transition-colors text-xs">{student.name}</span>
                      <span className="text-[10px] text-gray-400 truncate mt-0.5" title={student.thesisTitle}>
                        {student.thesisTitle}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${topicColor}`}>
                      {student.topic}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-gray-500 font-semibold uppercase">{student.classCode}</td>

                  <td className="py-4 px-4 text-right font-bold text-gray-500">Комисс {student.committeeId}</td>

                  <td className="py-4 px-6 text-right">
                    <span className="font-extrabold text-gray-800 text-sm">{score}</span>
                    <span className="text-[10px] text-gray-400 font-bold"> / 100</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeColor}`}>
                      {getLevelLabel(score)}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(student);
                      }}
                      className="w-7 h-7 rounded-lg hover:bg-primary-teal/5 text-gray-400 group-hover:text-primary-teal flex items-center justify-center mx-auto border border-transparent hover:border-primary-teal/10 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {students.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-gray-300 stroke-[1.5]" />
                  <p className="text-xs">Шүүлтүүрт тохирох оюутан олдсонгүй.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Area */}
      <div className="p-4 border-t border-card-border bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-400 shrink-0">
        <span>Нийт: {totalElements} оюутан</span>

        {/* Page bubbles and navigation */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-card-border bg-white text-gray-500 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {pageNumbers.map((num) => {
                const isActive = num === page;
                return (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary-teal text-white shadow-sm"
                        : "border border-transparent bg-white text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-card-border bg-white text-gray-500 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <span className="text-[10px] hidden md:inline">Шүүлтүүрийн дагуу хуудсаар ачаалсан дүн</span>
      </div>
    </div>
  );
}
