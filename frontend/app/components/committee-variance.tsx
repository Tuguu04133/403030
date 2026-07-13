"use client";

import React from "react";
import { CommitteeStat } from "../utils/mockData";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";

interface CommitteeVarianceProps {
  stats: CommitteeStat[];
  globalAvg: number;
}

export default function CommitteeVariance({ stats, globalAvg }: CommitteeVarianceProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-card-border shadow-sm flex flex-col h-full font-sans">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <Scale className="w-5 h-5 text-primary-teal" />
        <div>
          <h3 className="text-sm font-bold text-gray-800">Комиссын Дүнгийн Зөрүү</h3>
          <p className="text-xs text-gray-400">9 комиссын дундаж дүн болон дундаж зөрүү</p>
        </div>
      </div>

      {/* Global Average Info */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 border border-card-border rounded-xl mb-4">
        <span className="text-xs text-gray-500 font-semibold">Сонгосон үеийн глобал дундаж:</span>
        <span className="text-sm font-extrabold text-primary-teal">{globalAvg} / 100</span>
      </div>

      {/* Committees List with Deviation Indicators */}
      <div className="space-y-3.5 overflow-y-auto pr-1 flex-1 max-h-[300px]">
        {stats.map((stat) => {
          const hasVariance = stat.variance !== 0;
          const isPositive = stat.variance > 0;
          
          return (
            <div key={stat.committeeId} className="flex items-center justify-between gap-3 text-xs group hover:bg-gray-50/50 p-1 rounded-lg transition-all">
              {/* Committee Name and Students Count */}
              <div className="w-20 sm:w-24 shrink-0">
                <span className="font-bold text-gray-700 block">Комисс {stat.committeeId}</span>
                <span className="text-[10px] text-gray-400">{stat.studentCount} оюутан</span>
              </div>

              {/* Deviation visual line chart */}
              <div className="flex-1 flex items-center relative h-6 bg-gray-50 rounded-md overflow-hidden">
                {/* Center dividing line */}
                <div className="absolute inset-y-0 left-1/2 w-[1.5px] bg-gray-300 z-10" />

                {/* Variance bar */}
                {hasVariance && (
                  <div
                    className={`absolute h-3.5 rounded-sm transition-all duration-500 ${
                      isPositive ? "bg-accent-green" : "bg-primary-teal/60"
                    }`}
                    style={{
                      left: isPositive ? "50%" : `${50 - Math.min(50, Math.abs(stat.variance) * 8)}%`,
                      width: `${Math.min(50, Math.abs(stat.variance) * 8)}%`,
                    }}
                  />
                )}
              </div>

              {/* Values */}
              <div className="w-16 sm:w-24 text-right shrink-0 flex flex-col justify-center items-end">
                <span className="font-extrabold text-gray-800">{stat.avgGrade}</span>
                
                {hasVariance ? (
                  <span className={`text-[10px] font-bold flex items-center gap-0.5 ${
                    isPositive ? "text-accent-green-light" : "text-primary-teal"
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-2.5 h-2.5" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5" />
                    )}
                    {isPositive ? `+${stat.variance}` : stat.variance}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400 font-bold">0.0</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend footer */}
      <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center text-[9px] text-gray-400 font-bold border-t border-gray-100 pt-3 mt-4 shrink-0">
        <span>Зүүн тал: Чангa / Хатуу (Хасах зөрүү)</span>
        <span>Баруун тал: Зөөлөн / Өгөөмөр (Нэмэх зөрүү)</span>
      </div>
    </div>
  );
}

