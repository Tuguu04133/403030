"use client";

import React from "react";
import { BiasLeaderboardEntry, ExpertiseImpact } from "../utils/mockData";
import { ShieldAlert, ShieldCheck, HelpCircle, Award, Target } from "lucide-react";

interface TeacherLeaderboardProps {
  strict: BiasLeaderboardEntry[];
  lenient: BiasLeaderboardEntry[];
  expertiseImpact: ExpertiseImpact[];
  onSelectTeacher: (teacherId: string) => void;
}

export default function TeacherLeaderboard({
  strict,
  lenient,
  expertiseImpact,
  onSelectTeacher
}: TeacherLeaderboardProps) {
  return (
    <div className="space-y-6 font-sans">
      {/* 1. Strict vs Lenient Leaderboard Card */}
      <div className="bg-white rounded-2xl p-6 border border-card-border shadow-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <Award className="w-5 h-5 text-primary-teal" />
          <div>
            <h3 className="text-sm font-bold text-gray-800 font-sans">Хатуу & Зөөлөн багш нарын Лидерборд</h3>
            <p className="text-xs text-gray-400">Комиссын хамтран зүтгэгчдийн дунджаас зөрөх онооны хазайлт</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Strict Leaderboard */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary-teal bg-primary-teal/5 px-3 py-1.5 rounded-xl">
              <ShieldAlert className="w-4 h-4 text-primary-teal" />
              <span>Шилдэг 3 Чанга / Хатуу багш</span>
            </div>

            <div className="space-y-2">
              {strict.map((teacher, idx) => (
                <div 
                  key={teacher.teacherId}
                  onClick={() => onSelectTeacher(teacher.teacherId)}
                  className="flex items-center justify-between p-2.5 hover:bg-gray-50 border border-transparent hover:border-card-border rounded-xl cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary-teal/10 text-primary-teal flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-gray-800 hover:text-primary-teal-light transition-colors">{teacher.name}</span>
                      <span className="text-[9px] text-gray-400 font-semibold uppercase">{teacher.expertise} чиглэл</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-primary-teal bg-primary-teal/5 px-2 py-0.5 rounded-md">
                      {teacher.deviation} оноо
                    </span>
                    <span className="text-[9px] text-gray-400 block mt-0.5 font-medium">{teacher.studentCount} оюутан</span>
                  </div>
                </div>
              ))}
              {strict.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">Мэдээлэл байхгүй</p>
              )}
            </div>
          </div>

          {/* Lenient Leaderboard */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent-green bg-accent-green/5 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-accent-green" />
              <span>Шилдэг 3 Зөөлөн / Өгөөмөр багш</span>
            </div>

            <div className="space-y-2">
              {lenient.map((teacher, idx) => (
                <div 
                  key={teacher.teacherId}
                  onClick={() => onSelectTeacher(teacher.teacherId)}
                  className="flex items-center justify-between p-2.5 hover:bg-gray-50 border border-transparent hover:border-card-border rounded-xl cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-accent-green/10 text-accent-green flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-gray-800 hover:text-accent-green transition-colors">{teacher.name}</span>
                      <span className="text-[9px] text-gray-400 font-semibold uppercase">{teacher.expertise} чиглэл</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-accent-green-light bg-accent-green/5 px-2 py-0.5 rounded-md">
                      +{teacher.deviation} оноо
                    </span>
                    <span className="text-[9px] text-gray-400 block mt-0.5 font-medium">{teacher.studentCount} оюутан</span>
                  </div>
                </div>
              ))}
              {lenient.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">Мэдээлэл байхгүй</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Expertise Impact Factor Card */}
      {/* <div className="bg-white rounded-2xl p-6 border border-card-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-primary-teal" />
            <div>
              <h3 className="text-sm font-bold text-gray-800">Мэргэшлийн Нөлөөллийн Индекс</h3>
              <p className="text-xs text-gray-400">Өөрийн мэргэшсэн чиглэлийн оюутныг дүгнэх үеийн зөрүү хазайлт</p>
            </div>
          </div>
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-300 hover:text-gray-500 cursor-pointer" />
            <div className="absolute right-0 top-6 scale-0 group-hover:scale-100 bg-gray-800 text-white text-[9px] p-2.5 rounded-lg shadow-xl w-60 z-30 pointer-events-none transition-all leading-normal">
              Багш нарын мэргэшил оюутны сонгосон сэдэвтэй таарсан үед бусад багш нараас илүү өгөөмөр (+ оноо) эсвэл илүү чанга (- оноо) үнэлснийг илэрхийлнэ.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {expertiseImpact.map((impact) => {
            const isNegative = impact.expertDev < 0;
            const absoluteVal = Math.abs(impact.expertDev);
            return (
              <div 
                key={impact.topic} 
                className="bg-gray-50 border border-card-border p-3.5 rounded-xl flex flex-col justify-between items-center text-center transition-all duration-300 hover:scale-[1.02]"
              >
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide block mb-1">{impact.topic} чиглэл</span>
                <span className={`text-sm font-extrabold block my-1 ${
                  isNegative ? "text-primary-teal" : "text-accent-green"
                }`}>
                  {impact.expertDev === 0 ? "0.0" : isNegative ? `${impact.expertDev}` : `+${impact.expertDev}`}
                </span>
                <span className="text-[9px] text-gray-400 font-semibold block leading-tight">
                  {impact.expertDev === 0 
                    ? "Хазайлт үгүй" 
                    : isNegative 
                      ? `${absoluteVal} оноо чанга` 
                      : `${absoluteVal} оноо зөөлөн`}
                </span>
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
}
