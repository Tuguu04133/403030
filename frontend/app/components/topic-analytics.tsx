"use client";

import React from "react";
import { TopicStat } from "../utils/mockData";
import { Award, GraduationCap, X } from "lucide-react";

interface TopicAnalyticsProps {
  stats: TopicStat[];
  filteredTopic: string | null;
  setFilteredTopic: (topic: string | null) => void;
}

export default function TopicAnalytics({
  stats,
  filteredTopic,
  setFilteredTopic
}: TopicAnalyticsProps) {
  // Find max values to scale the SVG bars correctly
  const maxAvgGrade = Math.max(...stats.map(s => s.avgGrade), 100);
  const maxSupervisorAvg = Math.max(...stats.map(s => s.supervisorAvg), 15);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-card-border shadow-sm flex flex-col h-full font-sans">
      {/* Card Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-5 h-5 text-primary-teal" />
          <div>
            <h3 className="text-sm font-bold text-gray-800">Сэдвийн чиглэл ба Амжилтын хамаарал</h3>
            <p className="text-xs text-gray-400">Сэдвийн ангилал тус бүрээрх дундаж дүнгийн харьцуулалт</p>
          </div>
        </div>

        {filteredTopic && (
          <button
            onClick={() => setFilteredTopic(null)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-primary-teal bg-primary-teal/5 hover:bg-primary-teal/10 rounded-lg transition-all font-semibold"
          >
            Шүүлт цэвэрлэх
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Analytics chart and details panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 flex-1 items-stretch">
        {/* SVG Dual-Bar Chart */}
        <div className="lg:col-span-2 flex flex-col justify-between lg:border-r border-gray-100 lg:pr-6 min-h-[220px] overflow-x-auto">
          {/* Chart Y Axis Labels */}
          <div className="relative flex-1 flex min-w-[560px] items-stretch">
            {/* Y axis helper lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-dashed border-gray-100 w-full h-0" />
              <div className="border-b border-solid border-gray-200 w-full h-0 z-10" />
              <div className="border-b border-dashed border-gray-100 w-full h-0" />
            </div>

            {/* Left Y-axis labels */}
            <div className="w-8 flex flex-col justify-between text-[10px] text-gray-400 font-semibold select-none z-10 py-1">
              <span>100</span>
              <span>Дүн</span>
              <span>15</span>
            </div>

            {/* Bars container */}
            <div className="flex-1 flex justify-around items-stretch ml-4 relative z-10">
              {stats.map((item) => {
                const isSelected = filteredTopic === item.topic;
                const isAnySelected = filteredTopic !== null;
                
                // Scale calculations (Upper bar height: 0 to 90px, Lower bar height: 0 to 70px)
                const upperHeight = (item.avgGrade / maxAvgGrade) * 90;
                const lowerHeight = (item.supervisorAvg / maxSupervisorAvg) * 70;

                return (
                  <div
                    key={item.topic}
                    onClick={() => setFilteredTopic(isSelected ? null : item.topic)}
                    className={`flex flex-col items-center cursor-pointer transition-all duration-300 w-16 group relative ${
                      isAnySelected && !isSelected ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    {/* Hover tooltip */}
                    <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-primary-teal text-white text-[10px] px-2 py-1 rounded shadow-md z-20 pointer-events-none transition-transform font-bold text-center">
                      Хамгаалалт: {item.avgGrade}
                      <br />
                      Удирдагч: {item.supervisorAvg}
                    </div>

                    {/* Upper Bar (Defense average grade) - Teal */}
                    <div className="flex-1 flex items-end justify-center w-full pb-0.5">
                      <div
                        style={{ height: `${upperHeight}px` }}
                        className={`w-8 rounded-t-md transition-all duration-300 ${
                          isSelected 
                            ? "bg-primary-teal shadow-md ring-2 ring-primary-teal ring-offset-2" 
                            : "bg-primary-teal/80 group-hover:bg-primary-teal"
                        }`}
                      />
                    </div>

                    {/* Baseline */}
                    <div className="w-10 h-[2px] bg-gray-300 z-10" />

                    {/* Lower Bar (Supervisor average grade) - Accent Green */}
                    <div className="flex-1 flex items-start justify-center w-full pt-0.5">
                      <div
                        style={{ height: `${lowerHeight}px` }}
                        className={`w-8 rounded-b-md transition-all duration-300 ${
                          isSelected 
                            ? "bg-accent-green shadow-md ring-2 ring-accent-green ring-offset-2" 
                            : "bg-accent-green/80 group-hover:bg-accent-green"
                        }`}
                      />
                    </div>

                    {/* X axis Label */}
                    <span className={`text-xs mt-2 font-bold transition-colors duration-200 ${
                      isSelected ? "text-primary-teal font-extrabold" : "text-gray-500"
                    }`}>
                      {item.topic}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Timeline / Scale Indicators */}
          <div className="flex min-w-[560px] flex-col gap-2 sm:flex-row sm:justify-between sm:items-center text-[10px] text-gray-400 font-semibold px-4 pt-2 border-t border-gray-50 mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-primary-teal rounded-sm" />
              Хамгаалалтын дундаж
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-accent-green rounded-sm" />
              Удирдагчийн дундаж
            </span>
          </div>
        </div>

        {/* Dynamic Detail Card panel on the right */}
        <div className="flex flex-col justify-between py-1 bg-gray-50 p-4 rounded-xl">
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Дэлгэрэнгүй</span>
            
            {filteredTopic ? (
              (() => {
                const topicStat = stats.find(s => s.topic === filteredTopic);
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Сонгосон чиглэл:</span>
                      <span className="text-xs font-bold text-primary-teal bg-primary-teal/10 px-2.5 py-0.5 rounded-full">{filteredTopic}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Нийт оюутан:</span>
                      <span className="text-xs font-bold text-gray-800">{topicStat?.count} оюутан</span>
                    </div>
                    <div className="border-t border-gray-200/50 my-2" />
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Дундаж амжилт:</span>
                        <span className="font-bold text-gray-800">{topicStat?.avgGrade} / 100</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary-teal h-full rounded-full transition-all duration-500" 
                          style={{ width: `${topicStat ? (topicStat.avgGrade) : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-6 text-gray-400 space-y-2">
                <Award className="w-8 h-8 mx-auto text-gray-300 stroke-[1.5]" />
                <p className="text-xs">График дээр дарж сэдвээр шүүнэ үү.</p>
              </div>
            )}
          </div>

          <div className="text-[10px] text-gray-400 bg-white border border-gray-100 rounded-lg p-2 leading-relaxed">
            Шүүлт хийснээр оюутны жагсаалт тухайн сэдвээр шүүгдэнэ.
          </div>
        </div>
      </div>
    </div>
  );
}

