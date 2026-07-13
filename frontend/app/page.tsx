"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "./context/DashboardContext";
import { useDetailsOverlays } from "./hooks/useDetailsOverlays";
import TopicAnalytics from "./components/topic-analytics";
import CommitteeVariance from "./components/committee-variance";
import GradePieChart from "./components/grade-pie-chart";
import StudentList from "./components/student-list";
import TeacherPopover from "./components/teacher-popover";
import StudentDrawer from "./components/student-drawer";
import { FileSpreadsheet, TrendingUp, Users2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Student } from "./utils/mockData";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.20.10.3:8000";

export default function OverviewPage() {
  const { year, semester } = useDashboard();

  // Local overview page state
  const [kpiStats, setKpiStats] = useState({ totalStudents: 0, averageGrade: 0, maxGrade: 0, minGrade: 0 });
  const [topicStats, setTopicStats] = useState<any[]>([]);
  const [committeeStats, setCommitteeStats] = useState<any[]>([]);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentPage, setStudentPage] = useState(1);
  const [totalStudentPages, setTotalStudentPages] = useState(1);
  const [totalStudentElements, setTotalStudentElements] = useState(0);
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [filteredTopic, setFilteredTopic] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Fetch analytical summaries
  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const queryParams = `?year=${year}&semester=${encodeURIComponent(semester)}`;
      const [kpiRes, topicRes, commRes] = await Promise.all([
        fetch(`${BASE_URL}/api/v1/analytics/overview${queryParams}`),
        fetch(`${BASE_URL}/api/v1/analytics/topics${queryParams}`),
        fetch(`${BASE_URL}/api/v1/analytics/committees${queryParams}`)
      ]);

      if (!kpiRes.ok || !topicRes.ok || !commRes.ok) {
        throw new Error("Analytics fetch failed");
      }

      const [kpis, topics, committees] = await Promise.all([
        kpiRes.json(),
        topicRes.json(),
        commRes.json()
      ]);

      setKpiStats(kpis);
      setTopicStats(topics);
      setCommitteeStats(committees);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setErrorMessage("Сервэртэй холбогдоход алдаа гарлаа.");
    } finally {
      setIsLoading(false);
    }
  }, [year, semester]);

  // Fetch paginated student lists
  const fetchStudents = useCallback(async () => {
    setStudentsLoading(true);
    try {
      let url = `${BASE_URL}/api/v1/students?year=${year}&semester=${encodeURIComponent(semester)}&page=${studentPage}&size=15`;
      if (filteredTopic) {
        url += `&topic=${encodeURIComponent(filteredTopic)}`;
      }
      if (levelFilter && levelFilter !== "ALL") {
        url += `&level=${encodeURIComponent(levelFilter)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Student fetch failed");
      const data = await res.json();

      if (data && data.content) {
        setStudents(data.content);
        if (data.pagination) {
          setTotalStudentElements(data.pagination.totalElements);
          setTotalStudentPages(data.pagination.totalPages);
        }
      } else if (Array.isArray(data)) {
        setStudents(data);
        setTotalStudentElements(data.length);
        setTotalStudentPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
    } finally {
      setStudentsLoading(false);
    }
  }, [year, semester, filteredTopic, levelFilter, studentPage]);

  // Trigger fetches on dependency changes
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Reset page when category filters change
  useEffect(() => {
    setStudentPage(1);
  }, [filteredTopic, levelFilter]);

  return (
    <div className="space-y-5 sm:space-y-8 animate-fadeIn">
      {isLoading && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <Loader2 className="w-10 h-10 text-primary-teal animate-spin" />
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {/* Average Grade Large Card (Teal) */}
        <div className="lg:col-span-2 bg-primary-teal rounded-2xl p-5 sm:p-6 text-white flex flex-col justify-between shadow-sm relative overflow-hidden group hover:bg-primary-teal-dark transition-all duration-300">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 select-none pointer-events-none">
            <FileSpreadsheet className="w-64 h-64" />
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start z-10">
            <div className="space-y-1">
              <span className="text-xs font-bold text-accent-green uppercase tracking-wider block">Хамгаалалтын дундаж дүн</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none mt-1">
                {kpiStats.averageGrade} <span className="text-lg font-normal text-white/70">/ 100</span>
              </h2>
            </div>
            {/* Performance trend pill */}
            <span className="flex items-center gap-1 bg-accent-green text-primary-teal font-extrabold text-[10px] px-2 py-1 rounded-full shadow-sm">
              <TrendingUp className="w-3 h-3" />
              +3.2% өсөлт
            </span>
          </div>

          <div className="border-t border-white/10 pt-4 mt-6 z-10 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-xs">
            <span className="text-white/60 font-semibold">Сонгосон улирлын нийт хамгаалалтын дундаж дүн</span>
            <Link 
              href="/students"
              className="text-accent-green hover:underline font-bold flex items-center gap-1"
            >
              Оюутнууд харах
              <span>&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Student Count KPI Card */}
        <div className="bg-white border border-card-border rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:scale-[1.01] transition-transform duration-300">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Нийт оюутны тоо</span>
              <h3 className="text-3xl font-extrabold text-gray-800 leading-none mt-1">
                {kpiStats.totalStudents} <span className="text-xs font-normal text-gray-400">оюутан</span>
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-card-border text-primary-teal">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[10px] text-gray-400 font-bold border-t border-gray-100 pt-3 mt-4">
            Идэвхтэй шүүлтүүрт тохирсон оюутнууд
          </div>
        </div>
      </div>

      {/* Row of 2 Min/Max stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Max Grade Card */}
        <div className="bg-white border border-card-border rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Хамгийн өндөр дүн</span>
            <span className="text-xl font-extrabold text-gray-800 block">{kpiStats.maxGrade} оноо</span>
          </div>
          <span className="text-[10px] font-bold text-accent-green-light bg-accent-green/5 border border-accent-green/20 px-2.5 py-0.5 rounded-full uppercase">Маш сайн</span>
        </div>

        {/* Min Grade Card */}
        <div className="bg-white border border-card-border rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Хамгийн бага дүн</span>
            <span className="text-xl font-extrabold text-gray-800 block">{kpiStats.minGrade} оноо</span>
          </div>
          <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase">Сул</span>
        </div>
      </div>

      {/* Topic Analytics (Full Width) */}
      <div>
        <TopicAnalytics
          stats={topicStats}
          filteredTopic={filteredTopic}
          setFilteredTopic={setFilteredTopic}
        />
      </div>

      {/* Committee Variance & Grade Letter Distribution Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        <CommitteeVariance
          stats={committeeStats}
          globalAvg={kpiStats.averageGrade}
        />
        <GradePieChart students={students} />
      </div>

      {/* Recent Activity Drill-Down list */}
      <div>
        <StudentList
          students={students}
          loading={studentsLoading}
          page={studentPage}
          setPage={setStudentPage}
          totalPages={totalStudentPages}
          totalElements={totalStudentElements}
          levelFilter={levelFilter}
          setLevelFilter={setLevelFilter}
          onSelectStudent={setSelectedStudent}
        />
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

