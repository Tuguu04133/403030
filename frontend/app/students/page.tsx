"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDashboard } from "../context/DashboardContext";
import { useDetailsOverlays } from "../hooks/useDetailsOverlays";
import StudentList from "../components/student-list";
import TeacherPopover from "../components/teacher-popover";
import StudentDrawer from "../components/student-drawer";
import { Search, Download, Loader2 } from "lucide-react";
import { Student } from "../utils/mockData";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.20.10.3:8000";

export default function StudentsPage() {
  const { year, semester } = useDashboard();

  // Local student directory page state
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentPage, setStudentPage] = useState(1);
  const [totalStudentPages, setTotalStudentPages] = useState(1);
  const [totalStudentElements, setTotalStudentElements] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filteredTopic, setFilteredTopic] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [exporting, setExporting] = useState(false);

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
      setDebouncedSearchQuery(searchQuery);
      setStudentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when topic or level filter changes
  useEffect(() => {
    setStudentPage(1);
  }, [filteredTopic, levelFilter]);

  // Fetch paginated student list
  const fetchStudents = useCallback(async () => {
    setStudentsLoading(true);
    try {
      let url = `${BASE_URL}/api/v1/students?year=${year}&semester=${encodeURIComponent(semester)}&page=${studentPage}&size=15`;
      if (debouncedSearchQuery) {
        url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
      }
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
  }, [year, semester, debouncedSearchQuery, filteredTopic, levelFilter, studentPage]);

  // Trigger fetch when inputs modify
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Export CSV locally
  const exportCSV = async () => {
    setExporting(true);
    try {
      let url = `${BASE_URL}/api/v1/students?year=${year}&semester=${encodeURIComponent(semester)}&page=1&size=10000`;
      if (debouncedSearchQuery) {
        url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
      }
      if (filteredTopic) {
        url += `&topic=${encodeURIComponent(filteredTopic)}`;
      }
      if (levelFilter && levelFilter !== "ALL") {
        url += `&level=${encodeURIComponent(levelFilter)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      const listToExport = data.content || data;

      if (!listToExport || listToExport.length === 0) {
        alert("Экспортлох оюутан олдсонгүй.");
        return;
      }

      const headers = [
        "Оюутны нэр",
        "Анги",
        "Сэдвийн чиглэл",
        "Дипломын сэдэв",
        "Удирдагч багш",
        "Удирдагчийн оноо (15)",
        "Үзлэгийн оноо (20)",
        "Урьдчилсан оноо (25)",
        "Шүүмжлэгчийн оноо (5)",
        "Хамгаалалтын дундаж (35)",
        "Нийт оноо (100)"
      ];

      const rows = listToExport.map((s: any) => [
        s.name,
        s.classCode,
        s.topic,
        `"${s.thesisTitle.replace(/"/g, '""')}"`,
        s.supervisorName || "",
        s.supervisorGrade || 0,
        s.firstReviewGrade || 0,
        s.preDefenseGrade || 0,
        s.reviewerGrade || 0,
        s.finalDefenseAverage || (s.totalScore - (s.supervisorGrade + s.firstReviewGrade + s.preDefenseGrade + s.reviewerGrade)) || 0,
        s.totalScore || s.totalGrade || 0
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8,\uFEFF" +
        [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `GradPulse_Grades_${year}_${semester === "Хавар" ? "Spring" : "Autumn"}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
      alert("Экспортлоход алдаа гарлаа.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search Filter Header Card */}
      <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex-1 text-left">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Нарийвчилсан хайлт болон шүүлт</h3>
          <p className="text-xs text-gray-400 mb-4">
            Сэдвийн чиглэлийн шүүлт одоогоор:{" "}
            <span className="font-extrabold text-primary-teal">{filteredTopic || "Бүх сэдэв"}</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Оюутны нэр эсвэл сэдвийн түлхүүр үгээр хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-card-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-teal focus:bg-white transition-all text-gray-800"
              />
            </div>
            {filteredTopic && (
              <button
                onClick={() => setFilteredTopic(null)}
                className="px-4 py-2.5 bg-primary-teal/10 text-primary-teal rounded-xl text-xs font-semibold hover:bg-primary-teal/15 transition-all cursor-pointer shrink-0"
              >
                Сэдвийн шүүлт цуцлах
              </button>
            )}
          </div>
        </div>

        {/* CSV export action button */}
        <button
          onClick={exportCSV}
          disabled={exporting}
          className="flex items-center justify-center gap-2 bg-primary-teal text-white hover:bg-primary-teal-light disabled:opacity-50 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer h-[38px] shrink-0"
        >
          {exporting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          Дүнгийн жагсаалт экспортлох
        </button>
      </div>

      {/* Main Student Drill-Down List Table */}
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
