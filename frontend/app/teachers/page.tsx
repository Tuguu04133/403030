"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../context/DashboardContext";
import { useDetailsOverlays } from "../hooks/useDetailsOverlays";
import TeacherLeaderboard from "../components/teacher-leaderboard";
import AdviserRecommender from "../components/adviser-recommender";
import TeacherPopover from "../components/teacher-popover";
import StudentDrawer from "../components/student-drawer";
import { UserCheck, Search, ChevronLeft, ChevronRight, UserCircle, Loader2 } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.20.10.3:8000";

export default function TeachersPage() {
  const { year, semester } = useDashboard();

  // Local state for teachers directory
  const [teachersList, setTeachersList] = useState<any[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [teacherSearchQuery, setTeacherSearchQuery] = useState("");
  const [debouncedTeacherSearchQuery, setDebouncedTeacherSearchQuery] = useState("");
  const [teacherPage, setTeacherPage] = useState(1);
  const [teacherPageSize] = useState(15);
  const [totalTeacherElements, setTotalTeacherElements] = useState(0);
  const [totalTeacherPages, setTotalTeacherPages] = useState(1);

  // Bias Leaderboard state
  const [strict, setStrict] = useState<any[]>([]);
  const [lenient, setLenient] = useState<any[]>([]);
  const [expertiseImpact, setExpertiseImpact] = useState<any[]>([]);
  const [biasLoading, setBiasLoading] = useState(false);

  // Scoped overlays hook
  const {
    selectedStudent,
    setSelectedStudent,
    selectedTeacherId,
    setSelectedTeacherId,
    studentGradesDetail,
    studentGradesLoading,
    activeTeacherProfile,
    teacherProfileLoading
  } = useDetailsOverlays(year, semester);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTeacherSearchQuery(teacherSearchQuery);
      setTeacherPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [teacherSearchQuery]);

  // Fetch bias statistics and leaderboards
  const fetchBiasStats = useCallback(async () => {
    setBiasLoading(true);
    try {
      const queryParams = `?year=${year}&semester=${encodeURIComponent(semester)}`;
      const [biasRes, expRes] = await Promise.all([
        fetch(`${BASE_URL}/api/v1/analytics/teachers/bias${queryParams}`),
        fetch(`${BASE_URL}/api/v1/analytics/topics/expertise-impact${queryParams}`)
      ]);

      if (!biasRes.ok || !expRes.ok) throw new Error("Bias statistics fetch failed");

      const [bias, exp] = await Promise.all([
        biasRes.json(),
        expRes.json()
      ]);

      setStrict(bias.strict || []);
      setLenient(bias.lenient || []);
      setExpertiseImpact(exp || []);
    } catch (err) {
      console.error("Failed to load teacher stats:", err);
    } finally {
      setBiasLoading(false);
    }
  }, [year, semester]);

  // Fetch paginated teachers list
  const fetchTeachers = useCallback(async () => {
    setTeachersLoading(true);
    try {
      let url = `${BASE_URL}/api/v1/teachers?year=${year}&semester=${encodeURIComponent(semester)}&page=${teacherPage}&size=${teacherPageSize}`;
      if (debouncedTeacherSearchQuery) {
        url += `&search=${encodeURIComponent(debouncedTeacherSearchQuery)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Teacher fetch failed");
      const data = await res.json();

      if (data && data.content) {
        setTeachersList(data.content);
        if (data.pagination) {
          setTotalTeacherElements(data.pagination.totalElements);
          setTotalTeacherPages(data.pagination.totalPages);
        }
      } else if (Array.isArray(data)) {
        setTeachersList(data);
        setTotalTeacherElements(data.length);
        setTotalTeacherPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    } finally {
      setTeachersLoading(false);
    }
  }, [year, semester, debouncedTeacherSearchQuery, teacherPage, teacherPageSize]);

  // Run fetches
  useEffect(() => {
    fetchBiasStats();
  }, [fetchBiasStats]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Generate page bubbles array
  const pageNumbers = [];
  for (let i = 1; i <= totalTeacherPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Smart adviser recommender */}
      <AdviserRecommender 
        onSelectTeacher={setSelectedTeacherId}
        onSelectStudent={setSelectedStudent}
      />

      {/* Teacher leaderboards & expertise impact factors */}
      {biasLoading ? (
        <div className="bg-white rounded-2xl p-12 border border-card-border shadow-sm flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-primary-teal animate-spin" />
          <span className="text-xs text-gray-400 font-semibold">Багш нарын статистик мэдээллийг ачаалж байна...</span>
        </div>
      ) : (
        <TeacherLeaderboard
          strict={strict}
          lenient={lenient}
          expertiseImpact={expertiseImpact}
          onSelectTeacher={setSelectedTeacherId}
        />
      )}

      {/* Paginated Teachers Table */}
      <div className="bg-white rounded-2xl border border-card-border shadow-sm flex flex-col relative overflow-hidden">
        {/* Loading Indicator */}
        {teachersLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 border-4 border-primary-teal border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] text-primary-teal font-bold uppercase tracking-wider">Ачаалж байна...</span>
            </div>
          </div>
        )}

        {/* Header with Search */}
        <div className="p-6 border-b border-card-border flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-primary-teal" />
            <div className="text-left">
              <h3 className="text-sm font-bold text-gray-800">Төгсөлтийн ажлын комиссын багш нар</h3>
              <p className="text-xs text-gray-400">Нийт шүүгч багш нарын хайлт, мэдээлэл болон дүнгийн тархалт</p>
            </div>
          </div>

          {/* Teacher Search Input */}
          <div className="relative w-64 self-start md:self-auto">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Багшийн нэр эсвэл мэргэшлээр хайх..."
              value={teacherSearchQuery}
              onChange={(e) => setTeacherSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-card-border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary-teal focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-card-border bg-gray-50/50 select-none uppercase font-bold text-[10px] tracking-wider sticky top-0 z-10">
                <th className="py-3 px-6">Багшийн нэр</th>
                <th className="py-3 px-6">Мэргэшил</th>
                <th className="py-3 px-6 text-center">Комисс</th>
                <th className="py-3 px-6 text-right">Үнэлсэн Оюутнууд</th>
                <th className="py-3 px-6 text-center">Дүнгийн муруй</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teachersList.map((teacher) => {
                // Determine expertise color badge
                let expColor = "";
                if (teacher.expertise === "AI") expColor = "bg-violet-50 text-violet-600";
                else if (teacher.expertise === "AppDev") expColor = "bg-blue-50 text-blue-600";
                else if (teacher.expertise === "Game") expColor = "bg-amber-50 text-amber-600";
                else expColor = "bg-emerald-50 text-emerald-600";

                return (
                  <tr
                    key={teacher.id}
                    onClick={() => setSelectedTeacherId(teacher.id)}
                    className="hover:bg-gray-50/80 cursor-pointer transition-all duration-150 group border-b border-gray-100/50"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-teal/5 flex items-center justify-center text-primary-teal font-semibold text-xs border border-primary-teal/10 shrink-0">
                        <UserCircle className="w-4 h-4 text-primary-teal" />
                      </div>
                      <span className="font-bold text-gray-800 group-hover:text-primary-teal transition-colors text-xs">{teacher.name}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${expColor}`}>
                        {teacher.expertise} мэргэжилтэн
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="text-[10px] bg-primary-teal/5 text-primary-teal font-bold px-2 py-0.5 rounded">
                        Комисс {teacher.committeeId}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-bold text-gray-700">
                      {teacher.studentCount || 0} оюутан
                    </td>

                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeacherId(teacher.id);
                        }}
                        className="text-xs text-primary-teal bg-primary-teal/5 hover:bg-primary-teal/10 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        Үзэх
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {teachersList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <p className="text-xs">Тохирох багш олдсонгүй.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-card-border bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-400 shrink-0">
          <span>Нийт: {totalTeacherElements} багш</span>

          {totalTeacherPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTeacherPage(Math.max(1, teacherPage - 1))}
                disabled={teacherPage === 1}
                className="p-1.5 rounded-lg border border-card-border bg-white text-gray-500 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {pageNumbers.map((num) => {
                  const isActive = num === teacherPage;
                  return (
                    <button
                      key={num}
                      onClick={() => setTeacherPage(num)}
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
                onClick={() => setTeacherPage(Math.min(totalTeacherPages, teacherPage + 1))}
                disabled={teacherPage === totalTeacherPages}
                className="p-1.5 rounded-lg border border-card-border bg-white text-gray-500 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <span className="text-[10px] hidden md:inline">Шүүгчдийн хуудасласан жагсаалт</span>
        </div>
      </div>

      {/* OVERLAY POPUPS AND DRAWERS */}
      {activeTeacherProfile && (
        <TeacherPopover 
          profile={activeTeacherProfile}
          loading={teacherProfileLoading}
          onClose={() => setSelectedTeacherId(null)}
        />
      )}

      {selectedStudent && (
        <StudentDrawer 
          student={selectedStudent}
          gradesDetail={studentGradesDetail}
          gradesLoading={studentGradesLoading}
          onClose={() => setSelectedStudent(null)}
          onSelectTeacher={(tId) => {
            setSelectedStudent(null);
            setSelectedTeacherId(tId);
          }}
        />
      )}
    </div>
  );
}
