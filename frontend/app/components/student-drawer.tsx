"use client";

import React, { useEffect, useState } from "react";
import { X, FileSpreadsheet, User, Calculator, Loader2 } from "lucide-react";

interface StudentDrawerProps {
  student: any;
  gradesDetail: any | null;
  gradesLoading: boolean;
  onClose: () => void;
  onSelectTeacher: (teacherId: string) => void;
}

export default function StudentDrawer({
  student,
  gradesDetail,
  gradesLoading,
  onClose,
  onSelectTeacher
}: StudentDrawerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Compute total score and final average from the detail payload (or fallback to student summary score)
  const detail = gradesDetail;
  const totalScore = detail
    ? (detail.supervisorGrade + detail.firstReviewGrade + detail.preDefenseGrade + detail.reviewerGrade + detail.finalDefenseAverage)
    : (student.totalScore || student.totalGrade || 0);

  const finalAvg = detail ? detail.finalDefenseAverage : 0;

  let scoreTheme = "text-primary-teal bg-primary-teal/5 border-primary-teal/10";
  if (totalScore >= 90) scoreTheme = "text-accent-green-light bg-accent-green/5 border-accent-green/10";
  else if (totalScore < 70) scoreTheme = "text-red-500 bg-red-50 border-red-100";

  return (
    <div className="fixed inset-0 z-40 flex justify-end font-sans">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 animate-fadeIn"
      />

      {/* Drawer Sheet */}
      <div 
        className={`w-full max-w-lg bg-white h-full relative z-10 shadow-2xl flex flex-col transition-transform duration-300 ${
          isMounted ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-card-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-teal flex items-center justify-center text-white">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Дүнгийн Шатлалт Задаргаа</h3>
              <p className="text-xs text-gray-400">Оюутны 5 шатлалт нарийвчилсан дүнгийн мэдээлэл</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Dynamic content rendering based on loading state */}
        {gradesLoading || !detail ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-primary-teal animate-spin" />
            <span className="text-xs text-gray-400 font-semibold">Онооны мэдээллийг ачаалж байна...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 animate-fadeIn">
            {/* Student metadata banner */}
            <div className="bg-gray-50 border border-card-border p-4 rounded-2xl flex justify-between items-start gap-4">
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Оюутны Мэдээлэл</span>
                <h4 className="text-sm font-bold text-gray-800 leading-tight">{detail.name}</h4>
                <p className="text-xs font-semibold text-gray-500">{detail.thesisTitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-primary-teal/5 text-primary-teal font-extrabold px-2 py-0.5 rounded uppercase">{detail.topic}</span>
                  <span className="text-[10px] bg-gray-200 text-gray-600 font-extrabold px-2 py-0.5 rounded">{detail.classCode}</span>
                  <span className="text-[10px] bg-gray-200 text-gray-600 font-extrabold px-2 py-0.5 rounded">Комисс {detail.committeeId}</span>
                </div>
              </div>

              {/* Total score block */}
              <div className={`p-4 rounded-xl border text-center shrink-0 w-24 ${scoreTheme}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider block text-gray-400 mb-0.5">Нийт дүн</span>
                <span className="text-2xl font-extrabold block leading-none">{totalScore}</span>
                <span className="text-[9px] font-bold block mt-1 uppercase text-gray-400">/ 100</span>
              </div>
            </div>

            {/* Stages steps list */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Дүнгийн 5 үе шат</h5>
              
              {/* Stage 1: Supervisor */}
              <div className="flex gap-4 items-start relative pb-4 border-l-2 border-gray-100 pl-4 ml-2">
                <div className="w-5 h-5 rounded-full bg-primary-teal text-white flex items-center justify-center font-bold text-[9px] absolute -left-[11px] top-0.5 shadow-sm">1</div>
                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Удирдагч багшийн үнэлгээ</span>
                    <span className="font-extrabold text-gray-800">{detail.supervisorGrade} <span className="text-[10px] text-gray-400 font-semibold">/ 15</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400 font-medium">
                    <User className="w-3 h-3 text-primary-teal" />
                    <span>Удирдагч: {detail.supervisorName}</span>
                  </div>
                </div>
              </div>

              {/* Stage 2: First Review */}
              <div className="flex gap-4 items-start relative pb-4 border-l-2 border-gray-100 pl-4 ml-2">
                <div className="w-5 h-5 rounded-full bg-primary-teal text-white flex items-center justify-center font-bold text-[9px] absolute -left-[11px] top-0.5 shadow-sm">2</div>
                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Комиссын эхний үзлэг</span>
                    <span className="font-extrabold text-gray-800">{detail.firstReviewGrade} <span className="text-[10px] text-gray-400 font-semibold">/ 20</span></span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">Сэдвийн хүрээ болон гүйцэтгэлийн хяналт</p>
                </div>
              </div>

              {/* Stage 3: Pre-Defense */}
              <div className="flex gap-4 items-start relative pb-4 border-l-2 border-gray-100 pl-4 ml-2">
                <div className="w-5 h-5 rounded-full bg-primary-teal text-white flex items-center justify-center font-bold text-[9px] absolute -left-[11px] top-0.5 shadow-sm">3</div>
                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Урьдчилсан хамгаалалт</span>
                    <span className="font-extrabold text-gray-800">{detail.preDefenseGrade} <span className="text-[10px] text-gray-400 font-semibold">/ 25</span></span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">Төслийн гүйцэтгэл болон бичвэрийн ерөнхий үнэлгээ</p>
                </div>
              </div>

              {/* Stage 4: Reviewer */}
              <div className="flex gap-4 items-start relative pb-4 border-l-2 border-gray-100 pl-4 ml-2">
                <div className="w-5 h-5 rounded-full bg-primary-teal text-white flex items-center justify-center font-bold text-[9px] absolute -left-[11px] top-0.5 shadow-sm">4</div>
                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Шүүмжлэгч багшийн үнэлгээ</span>
                    <span className="font-extrabold text-gray-800">{detail.reviewerGrade} <span className="text-[10px] text-gray-400 font-semibold">/ 5</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400 font-medium">
                    <User className="w-3 h-3 text-primary-teal" />
                    <span>Шүүмжлэгч: {detail.reviewerName}</span>
                  </div>
                </div>
              </div>

              {/* Stage 5: Final Defense */}
              <div className="flex gap-4 items-start relative pl-4 ml-2">
                <div className="w-5 h-5 rounded-full bg-primary-teal text-white flex items-center justify-center font-bold text-[9px] absolute -left-[11px] top-0.5 shadow-sm">5</div>
                <div className="flex-1 text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      <span className="font-bold text-gray-800 block">Жинхэнэ хамгаалалт</span>
                      <span className="text-[10px] text-accent-green font-bold block mt-0.5">Комиссын гишүүдийн дундаж</span>
                    </div>
                    <span className="font-extrabold text-gray-800 text-sm">
                      {finalAvg} <span className="text-[10px] text-gray-400 font-semibold">/ 35</span>
                    </span>
                  </div>

                  {/* Individual Committee Scores */}
                  <div className="bg-gray-50 border border-card-border rounded-xl p-3 space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Комиссын Багш нарын задаргаа</span>
                    
                    <div className="space-y-1.5">
                      {detail.finalDefenseGrades?.map((g: any) => (
                        <div key={g.teacherId} className="flex justify-between items-center text-xs p-1 rounded hover:bg-white transition-all">
                          <button
                            onClick={() => onSelectTeacher(g.teacherId)}
                            className="text-gray-600 hover:text-primary-teal transition-colors font-semibold text-left cursor-pointer flex items-center gap-1"
                          >
                            <span>{g.teacherName || "Комиссын Багш"}</span>
                            {g.isExpert && (
                              <span className="text-[8px] bg-accent-green/10 text-accent-green-light px-1 rounded-sm uppercase font-extrabold">Мэргэжилтэн</span>
                            )}
                          </button>
                          <span className="font-bold text-gray-800">{g.grade} оноо</span>
                        </div>
                      ))}
                    </div>

                    {/* Calculation details */}
                    {/* {detail.finalDefenseGrades && detail.finalDefenseGrades.length > 0 && (
                      <div className="border-t border-gray-200/60 pt-2.5 mt-2 flex items-start gap-2 text-[10px] text-gray-400">
                        <Calculator className="w-4 h-4 text-primary-teal shrink-0 mt-0.5" />
                        <div className="text-left">
                          <span className="font-bold text-gray-500 block mb-0.5">Дунджийг бодсон томьёо:</span>
                          <code className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded font-mono block mt-1 break-all">
                            ({detail.finalDefenseGrades.map((g: any) => g.grade).join(" + ")}) / {detail.finalDefenseGrades.length} = {finalAvg}
                          </code>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="p-4 border-t border-card-border bg-gray-50 flex items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-card-border text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            Хаах
          </button>
        </div>
      </div>
    </div>
  );
}
