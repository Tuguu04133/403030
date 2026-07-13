"use client";

import React, { useState } from "react";
import { TEACHERS, STUDENTS, calculateTotalScore } from "../utils/mockData";
import { Sparkles, BrainCircuit, UserCheck, Trophy, Loader2, Search } from "lucide-react";

interface RecommendedTeacherItem {
  teacherId: string;
  name: string;
  expertise: string;
  averageGradeGiven: number;
  studentCount: number;
  suitabilityScore: number;
}

interface InspirationalThesisItem {
  studentId: string;
  name: string;
  thesisTitle: string;
  classCode: string;
  topic: string;
  totalGrade: number;
}

interface AdviserRecommenderProps {
  onSelectTeacher: (teacherId: string) => void;
  onSelectStudent: (student: any) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.20.10.3:8000";

export default function AdviserRecommender({ onSelectTeacher, onSelectStudent }: AdviserRecommenderProps) {

  const [subjectInput, setSubjectInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [detectedField, setDetectedField] = useState<string | null>(null);

  // Recommendation states
  const [recommendedAdvisers, setRecommendedAdvisers] = useState<RecommendedTeacherItem[]>([]);
  const [inspirationalTheses, setInspirationalTheses] = useState<InspirationalThesisItem[]>([]);

  // Trigger search on form submit
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = subjectInput.trim();
    if (!text) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      // Query recommendation endpoint globally (WITHOUT year and semester parameters!)
      const url = `${BASE_URL}/api/v1/recommendations/advisers?subject=${encodeURIComponent(text)}&limit=3`;
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`API returned status ${res.status}`);
      }
      
      const data = await res.json();
      
      setDetectedField(data.fieldLabel || data.detectedField);
      setRecommendedAdvisers(data.recommendedTeachers || []);
      setInspirationalTheses(data.inspirationalTheses || []);
    } catch (err) {
      console.warn("Backend global recommendation API failed. Falling back to local frontend global simulation...", err);
      
      // Frontend local fallback classifier (queries globally across mock dataset)
      runFrontendFallback(text);
    } finally {
      setLoading(false);
    }
  };

  // Client-side classification and keyword similarity matching fallback (global)
  const runFrontendFallback = (text: string) => {
    let field: "AI" | "AppDev" | "Game" | "Sys" | null = null;
    const lowerText = text.toLowerCase();

    // 1. Broad category mapping for teacher matching
    if (
      lowerText.includes("хиймэл оюун") ||
      lowerText.includes("ai") ||
      lowerText.includes("cnn") ||
      lowerText.includes("deep learning") ||
      lowerText.includes("царай таних") ||
      lowerText.includes("nlp") ||
      lowerText.includes("machine learning") ||
      lowerText.includes("хэл боловсруулах") ||
      lowerText.includes("сургалт") ||
      lowerText.includes("lstm")
    ) {
      field = "AI";
    } else if (
      lowerText.includes("вэб") ||
      lowerText.includes("web") ||
      lowerText.includes("апп") ||
      lowerText.includes("app") ||
      lowerText.includes("erp") ||
      lowerText.includes("систем") ||
      lowerText.includes("сайт") ||
      lowerText.includes("платформ") ||
      lowerText.includes("цахим сонгууль")
    ) {
      field = "AppDev";
    } else if (
      lowerText.includes("тоглоом") ||
      lowerText.includes("game") ||
      lowerText.includes("vr") ||
      lowerText.includes("rpg") ||
      lowerText.includes("unity") ||
      lowerText.includes("shooter") ||
      lowerText.includes("тоглоомын")
    ) {
      field = "Game";
    } else if (
      lowerText.includes("сервер") ||
      lowerText.includes("server") ||
      lowerText.includes("сүлжээ") ||
      lowerText.includes("docker") ||
      lowerText.includes("cloud") ||
      lowerText.includes("аюулгүй байдал") ||
      lowerText.includes("network") ||
      lowerText.includes("linux") ||
      lowerText.includes("сүлж")
    ) {
      field = "Sys";
    }

    if (!field) {
      setDetectedField(null);
      setRecommendedAdvisers([]);
      setInspirationalTheses([]);
      return;
    }

    setDetectedField(
      field === "AI" ? "Хиймэл Оюун Ухаан (AI)" :
      field === "AppDev" ? "Хэрэглээний Програм Хангамж (AppDev)" :
      field === "Game" ? "Тоглоом Хөгжүүлэлт (Game)" :
      "Систем Хамгаалалт & Сүлжээ (Sys)"
    );

    // 2. Recommend teachers matching this expertise field
    const matchingTeachers = TEACHERS.filter((t) => t.expertise === field);
    const advisers = matchingTeachers.map((teacher, idx) => {
      let baseScore = 85.0;
      if (teacher.id === "t1" || teacher.id === "t9" || teacher.id === "t13") baseScore = 96.8;
      else if (teacher.id === "t3" || teacher.id === "t5") baseScore = 93.4;
      
      const score = baseScore - idx * 2.5;
      return {
        teacherId: teacher.id,
        name: teacher.name,
        expertise: teacher.expertise,
        averageGradeGiven: teacher.id === "t1" ? 28.5 : teacher.id === "t9" ? 27.2 : 26.1,
        studentCount: teacher.id === "t1" ? 12 : teacher.id === "t3" ? 10 : 8,
        suitabilityScore: Number(score.toFixed(1))
      };
    }).sort((a, b) => b.suitabilityScore - a.suitabilityScore).slice(0, 3);

    // 3. Match historical student theses globally by title keywords!
    // Split input subject into tokens/keywords (exclude particles and filler words)
    const fillerWords = ["ашиглан", "суурилсан", "систем", "хийх", "нь", "болон", "удирдлага", "хөгжүүлэлт", "загвар", "ашиглах"];
    const keywords = lowerText
      .split(/[\s,\.\-\/\(\)]+/)
      .filter(word => word.length > 1 && !fillerWords.includes(word));

    // Global matching: query ALL students globally (no year or semester filters!)
    const theses = STUDENTS.map((s) => {
      const totalGrade = calculateTotalScore(s);
      const titleLower = s.thesisTitle.toLowerCase();
      
      // Count matching keywords
      let matchCount = 0;
      keywords.forEach(kw => {
        if (titleLower.includes(kw)) {
          matchCount += 3; // base weight for matching exact keyword
        }
      });

      // Boost if the student topic matches the identified field
      if (s.topic === field) {
        matchCount += 1;
      }

      return {
        studentId: s.id,
        name: s.name,
        thesisTitle: s.thesisTitle,
        classCode: s.classCode,
        topic: s.topic,
        totalGrade,
        matchCount
      };
    })
    // Filter out matches with zero keyword overlap to prevent random irrelevant suggestions
    .filter(t => t.matchCount > 1)
    // Sort by:
    // 1. Keyword match density (matchCount desc)
    // 2. Performance grade (totalGrade desc) as a secondary tie-breaker
    .sort((a, b) => {
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }
      return b.totalGrade - a.totalGrade;
    })
    .slice(0, 3)
    .map(({ matchCount, ...rest }) => rest);

    setRecommendedAdvisers(advisers);
    setInspirationalTheses(theses);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-card-border shadow-sm flex flex-col font-sans space-y-5 relative overflow-hidden">
      {/* Loading overlay spinner */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 animate-fadeIn">
          <div className="flex flex-col items-center gap-1.5">
            <Loader2 className="w-8 h-8 text-primary-teal animate-spin" />
            <span className="text-[10px] text-primary-teal font-bold uppercase tracking-wider">Багш болон жишээ дипломуудыг тооцоолж байна...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Sparkles className="w-5 h-5 text-accent-green" />
        <div className="text-left">
          <h3 className="text-sm font-bold text-gray-800">Төстэй сэдэв & Удирдагч багш санал болгох</h3>
          <p className="text-xs text-gray-400">Сэдвийн чиглэлийн дагуу удирдагч багш ба шилдэг дипломуудын зөвлөмж</p>
        </div>
      </div>

      {/* Input Group form */}
      <form onSubmit={handleSearch} className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide text-left block">
          Таны төлөвлөж буй дипломын сэдэв:
        </label>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <input
            type="text"
            placeholder="Жишээ нь: Хиймэл оюун ашиглан царай таних систем, Unity RPG тоглоом хөгжүүлэх..."
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border border-card-border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal focus:bg-white transition-all placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={loading || !subjectInput.trim()}
            className="px-5 py-3 sm:py-0 bg-primary-teal text-white hover:bg-primary-teal-light disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4" />
            Хайх
          </button>
        </div>
      </form>

      {/* Results grid or initial placeholder prompt */}
      {hasSearched ? (
        detectedField && (recommendedAdvisers.length > 0 || inspirationalTheses.length > 0) ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 pt-2 animate-fadeIn">
            {/* Recommended Advisers */}
            <div className="space-y-3.5 lg:border-r border-gray-100 pr-0 lg:pr-6">
              <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs font-bold text-primary-teal bg-primary-teal/5 px-3 py-2 rounded-xl">
                <UserCheck className="w-4 h-4 text-primary-teal" />
                <span>Тохирох Удирдагч Багш нар</span>
                <span className="ml-auto text-[9px] bg-primary-teal text-white px-2 py-0.5 rounded font-extrabold truncate">
                  {detectedField}
                </span>
              </div>

              <div className="space-y-2">
                {recommendedAdvisers.map((teacher, idx) => (
                  <div
                    key={teacher.teacherId}
                    onClick={() => onSelectTeacher(teacher.teacherId)}
                    className="flex items-center justify-between gap-3 p-2.5 bg-gray-50/50 hover:bg-gray-50 border border-card-border rounded-xl cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary-teal/10 text-primary-teal flex items-center justify-center font-bold text-[9px] shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-gray-800 hover:text-primary-teal transition-colors">
                          {teacher.name}
                        </span>
                        <span className="text-[9px] text-gray-400 font-semibold uppercase">
                          Дундаж дүн: {teacher.averageGradeGiven} оноо
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-accent-green bg-accent-green/5 px-2 py-0.5 rounded border border-accent-green/10">
                        {teacher.suitabilityScore}% тохироц
                      </span>
                      <span className="text-[9px] text-gray-400 block mt-1 font-semibold">
                        {teacher.studentCount} оюутан
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspirational Theses */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-accent-green bg-accent-green/5 px-3 py-2 rounded-xl">
                <Trophy className="w-4 h-4 text-accent-green" />
                <span>Шилдэг Жишиг Дипломууд</span>
              </div>

              <div className="space-y-2">
                {inspirationalTheses.map((thesis) => (
                  <div
                    key={thesis.studentId}
                    onClick={() => {
                      // Find matching student
                      const match = STUDENTS.find(s => s.id === thesis.studentId);
                      if (match) {
                        onSelectStudent(match);
                      } else {
                        onSelectStudent({
                          ...thesis,
                          id: thesis.studentId
                        } as any);
                      }
                    }}
                    className="flex items-center justify-between gap-3 p-2.5 bg-gray-50/50 hover:bg-gray-50 border border-card-border rounded-xl cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0 pr-3">
                      <div className="flex flex-col text-left truncate">
                        <span className="text-xs font-bold text-gray-800 truncate">
                          {thesis.thesisTitle}
                        </span>
                        <span className="text-[9px] text-gray-400 font-semibold uppercase block truncate">
                          Оюутан: {thesis.name} | {thesis.classCode}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-xs font-extrabold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                        {thesis.totalGrade} оноо
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3.5 p-4 bg-gray-50 border border-card-border rounded-xl text-xs text-gray-500">
            <BrainCircuit className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="text-left leading-normal">
              <span className="font-bold text-gray-700 block mb-0.5 font-sans">Таарах илэрц олдсонгүй</span>
              Сэдвийнхээ талаар өөр түлхүүр үг оруулж хайна уу (Жишээ нь: царай таних, тоглоом, docker сүлжээ).
            </div>
          </div>
        )
      ) : (
        <div className="flex items-center gap-3.5 p-4 bg-gray-50 border border-card-border rounded-xl text-xs text-gray-500">
          <BrainCircuit className="w-5 h-5 text-gray-400 shrink-0" />
          <div className="text-left leading-normal font-sans">
            <span className="font-bold text-gray-700 block mb-0.5">Дипломын сэдэв зөвлөх систем</span>
            Бичих талбарт төлөвлөж буй дипломын сэдвээ оруулж, <strong className="text-primary-teal font-extrabold">Хайх</strong> товчийг дарна уу. Систем нь сэдэвт чиглэлийн дагуу удирдагч багш нар болон өмнөх онуудын шилдэг дипломуудыг санал болгоно.
          </div>
        </div>
      )}
    </div>
  );
}

