"use client";

import React, { useState } from "react";
import { PieChart, Award } from "lucide-react";
import { Student } from "../utils/mockData";

interface GradePieChartProps {
  students: Student[];
}

export default function GradePieChart({ students }: GradePieChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const total = students.length;

  // 1. Categorize scores into standard letter grades
  const getStudentScore = (student: any) => {
    return student.totalScore || student.totalGrade || 0;
  };

  const countA = students.filter(s => getStudentScore(s) >= 90).length;
  const countB = students.filter(s => getStudentScore(s) >= 80 && getStudentScore(s) < 90).length;
  const countC = students.filter(s => getStudentScore(s) >= 70 && getStudentScore(s) < 80).length;
  const countD = students.filter(s => getStudentScore(s) >= 60 && getStudentScore(s) < 70).length;
  const countF = students.filter(s => getStudentScore(s) < 60).length;

  const pctA = total > 0 ? (countA / total) * 100 : 0;
  const pctB = total > 0 ? (countB / total) * 100 : 0;
  const pctC = total > 0 ? (countC / total) * 100 : 0;
  const pctD = total > 0 ? (countD / total) * 100 : 0;
  const pctF = total > 0 ? (countF / total) * 100 : 0;

  const gradeData = [
    { label: "A", name: "Маш сайн", count: countA, pct: pctA, color: "#00D47E" }, // Mint green
    { label: "B", name: "Сайн", count: countB, pct: pctB, color: "#037584" },      // Light Teal
    { label: "C", name: "Дундаж", count: countC, pct: pctC, color: "#025864" },    // Primary Teal
    { label: "D", name: "Хангалттай", count: countD, pct: pctD, color: "#4c7e87" }, // Muted Teal
    { label: "F", name: "Муу/Сул", count: countF, pct: pctF, color: "#EF4444" }     // Muted red/fail
  ];

  // Donut SVG constants
  const r = 50;
  const circ = 2 * Math.PI * r; // 314.159
  const centerCoord = 80; // center at (80, 80)

  // Accumulate stroke-dashoffset parameters
  let cumulativePercent = 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-card-border shadow-sm flex flex-col h-full font-sans">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <PieChart className="w-5 h-5 text-primary-teal" />
        <div>
          <h3 className="text-sm font-bold text-gray-800">Үсэгт Дүнгийн Тархалт</h3>
          <p className="text-xs text-gray-400">A, B, C, D, F үнэлгээний хувийн харьцаа</p>
        </div>
      </div>

      {total === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 py-10">
          <Award className="w-10 h-10 text-gray-200 mb-2 stroke-[1.5]" />
          <p className="text-xs">Шүүлтүүрт дүнгийн мэдээлэл олдсонгүй.</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-8 flex-1">
          {/* Custom SVG Donut Plot */}
          <div className="relative w-52 h-52 shrink-0">
            <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx={centerCoord}
                cy={centerCoord}
                r={r}
                fill="transparent"
                stroke="#f3f4f6"
                strokeWidth="12"
              />

              {/* Dynamic Segments circles */}
              {gradeData.map((seg) => {
                if (seg.count === 0) return null;

                const segmentLength = (seg.pct / 100) * circ;
                const offset = circ - (cumulativePercent / 100) * circ;
                cumulativePercent += seg.pct;

                const isHovered = hoveredSegment === seg.label;

                return (
                  <circle
                    key={seg.label}
                    cx={centerCoord}
                    cy={centerCoord}
                    r={r}
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth={isHovered ? "20" : "12"}
                    strokeDasharray={`${segmentLength} ${circ}`}
                    strokeDashoffset={offset}
                    className="transition-all duration-300 cursor-pointer origin-center"
                    onMouseEnter={() => setHoveredSegment(seg.label)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={{
                      transformOrigin: "center"
                    }}
                  />
                );
              })}
            </svg>

            {/* Central Information Widget */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
              {hoveredSegment ? (
                (() => {
                  const seg = gradeData.find(g => g.label === hoveredSegment);
                  return (
                    <div className="animate-fadeIn">
                      <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wide block">{seg?.label} Дүн</span>
                      <span className="text-xs text-gray-500 font-bold block mt-0.5">{seg?.pct.toFixed(1)}% ({seg?.count})</span>
                    </div>
                  );
                })()
              ) : (
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Нийт</span>
                  <span className="text-3xl font-extrabold text-gray-800 leading-none mt-1 block">{total}</span>
                  <span className="text-xs text-gray-400 font-bold block mt-0.5">оюутан</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Legends list panel */}
          <div className="flex-1 space-y-2.5 w-full text-xs">
            {gradeData.map((seg) => {
              const isHovered = hoveredSegment === seg.label;
              return (
                <div
                  key={seg.label}
                  onMouseEnter={() => setHoveredSegment(seg.label)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className={`flex items-center justify-between p-1.5 rounded-lg transition-all cursor-pointer ${
                    isHovered ? "bg-gray-50 font-bold" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 text-left">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="font-bold text-gray-700 w-4">{seg.label}</span>
                    <span className="text-gray-400 text-[10px] hidden md:inline">({seg.name})</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-gray-800 font-extrabold">{seg.count}</span>
                    <span className="text-[10px] text-gray-400 font-bold ml-1.5">({seg.pct.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
