"use client";

import React from "react";
import { User, X, BarChart3, TrendingUp, Loader2 } from "lucide-react";

interface TeacherPopoverProps {
  profile: any;
  loading?: boolean;
  onClose: () => void;
}

export default function TeacherPopover({ profile, loading, onClose }: TeacherPopoverProps) {
  // Loading wrapper
  if (loading || !profile) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 font-sans">
        <div className="bg-white rounded-2xl w-[360px] p-12 shadow-2xl border border-card-border flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-primary-teal animate-spin" />
          <span className="text-xs text-gray-400 font-semibold">Багшийн мэдээллийг ачаалж байна...</span>
        </div>
      </div>
    );
  }

  const { name, expertise, committeeId, studentCount, averageGradeGiven, distribution } = profile;

  // Let's create an SVG path for the distribution bell curve.
  const dist = distribution || [0, 0, 0, 0, 0];
  const maxVal = Math.max(...dist, 1);
  const heights = dist.map((val: number) => (val / maxVal) * 80); // max height 80px

  // Bezier curve coordinate points mapping
  const p = heights.map((h: number, i: number) => ({
    x: 30 + i * 50,
    y: 100 - h
  }));

  const pathD = `
    M 10 100 
    C 20 100, ${p[0].x - 15} ${p[0].y}, ${p[0].x} ${p[0].y} 
    S ${p[1].x - 15} ${p[1].y}, ${p[1].x} ${p[1].y}
    S ${p[2].x - 15} ${p[2].y}, ${p[2].x} ${p[2].y}
    S ${p[3].x - 15} ${p[3].y}, ${p[3].x} ${p[3].y}
    S ${p[4].x - 15} ${p[4].y}, ${p[4].x} ${p[4].y}
    C ${p[4].x + 15} ${p[4].y}, 260 100, 270 100
  `;

  const closedPathD = `${pathD} L 270 100 L 10 100 Z`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 font-sans animate-fadeIn">
      {/* Popover Card */}
      <div className="bg-white rounded-2xl w-[360px] p-6 shadow-2xl border border-card-border relative animate-scaleUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile details */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-full bg-primary-teal/10 flex items-center justify-center text-primary-teal">
            <User className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-gray-800 leading-tight">{name}</h4>
            <p className="text-[10px] text-accent-green font-bold uppercase tracking-wider mt-0.5">{expertise} Мэргэжилтэн</p>
          </div>
        </div>

        {/* Committee & Student statistics */}
        <div className="grid grid-cols-2 gap-3.5 mb-6 text-xs">
          <div className="bg-gray-50 border border-card-border p-3 rounded-xl text-left">
            <span className="text-[10px] text-gray-400 font-bold block mb-0.5">Комиссын Дугаар</span>
            <span className="font-extrabold text-primary-teal">Комисс {committeeId}</span>
          </div>
          <div className="bg-gray-50 border border-card-border p-3 rounded-xl text-left">
            <span className="text-[10px] text-gray-400 font-bold block mb-0.5">Үнэлсэн Оюутнууд</span>
            <span className="font-extrabold text-gray-800">{studentCount} оюутан</span>
          </div>
        </div>

        {/* Avg score rating */}
        <div className="flex items-center justify-between p-3.5 bg-primary-teal/5 border border-primary-teal/10 rounded-xl mb-6 text-xs">
          <div className="flex items-center gap-2 text-primary-teal">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">Өгсөн дүнгийн дундаж:</span>
          </div>
          <span className="font-extrabold text-primary-teal text-sm">{averageGradeGiven} / 35</span>
        </div>

        {/* Spline curve visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-primary-teal" />
              <span>Дүнгийн тархалтын муруй</span>
            </div>
            <span className="text-[10px] text-gray-400">(18 - 35 оноо)</span>
          </div>

          <div className="bg-gray-50 border border-card-border rounded-xl p-4 flex flex-col items-center">
            {/* SVG curve plot */}
            <div className="w-full relative h-[110px]">
              <svg viewBox="0 0 280 110" className="w-full h-full">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#025864" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#025864" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid helper lines */}
                <line x1="0" y1="100" x2="280" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="60" x2="280" y2="60" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3" />
                <line x1="0" y1="20" x2="280" y2="20" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="3" />

                {/* Curve fills */}
                <path d={closedPathD} fill="url(#curveGradient)" />

                {/* Spline stroke */}
                <path d={pathD} fill="none" stroke="#00D47E" strokeWidth="2.5" strokeLinecap="round" />

                {/* Dots plotting */}
                {p.map((pt: any, idx: number) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="3.5"
                    fill="#025864"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="w-full flex justify-between text-[8px] text-gray-400 font-extrabold uppercase mt-2 px-1">
              <span>18-21</span>
              <span>22-25</span>
              <span>26-28</span>
              <span>29-31</span>
              <span>32-35</span>
            </div>
          </div>
        </div>

        {/* Close action */}
        <button
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-semibold mt-5 transition-all cursor-pointer"
        >
          Хаах
        </button>
      </div>
    </div>
  );
}
