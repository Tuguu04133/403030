"use client";

import { useState, useEffect, useCallback } from "react";
import { Student, TeacherProfile } from "../utils/mockData";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.20.10.3:8000";

export function useDetailsOverlays(year: number, semester: string) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  const [studentGradesDetail, setStudentGradesDetail] = useState<any | null>(null);
  const [studentGradesLoading, setStudentGradesLoading] = useState(false);

  const [activeTeacherProfile, setActiveTeacherProfile] = useState<TeacherProfile | null>(null);
  const [teacherProfileLoading, setTeacherProfileLoading] = useState(false);

  // 1. Fetch Student Grades details
  const fetchStudentGrades = useCallback(async (studentId: string) => {
    if (!studentId || studentId === "undefined") {
      return;
    }
    setStudentGradesLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/v1/students/${studentId}/grades`);
      if (!res.ok) throw new Error("Grades fetch failed");
      const data = await res.json();
      setStudentGradesDetail(data);
    } catch (err) {
      console.error("Failed to load student grades:", err);
      setStudentGradesDetail(null);
    } finally {
      setStudentGradesLoading(false);
    }
  }, []);

  // 2. Fetch Teacher Profile Curves
  const fetchTeacherProfile = useCallback(async (teacherId: string) => {
    setTeacherProfileLoading(true);
    try {
      const queryParams = `?year=${year}&semester=${encodeURIComponent(semester)}`;
      const res = await fetch(`${BASE_URL}/api/v1/teachers/${teacherId}/profile${queryParams}`);
      if (!res.ok) throw new Error("Teacher profile fetch failed");
      const data = await res.json();
      setActiveTeacherProfile(data);
    } catch (err) {
      console.error("Failed to load teacher profile:", err);
      setActiveTeacherProfile(null);
    } finally {
      setTeacherProfileLoading(false);
    }
  }, [year, semester]);

  // Effects to trigger fetches when selections modify
  useEffect(() => {
    if (selectedStudent && selectedStudent.id && selectedStudent.id !== "undefined") {
      fetchStudentGrades(selectedStudent.id);
    } else {
      setStudentGradesDetail(null);
    }
  }, [selectedStudent, fetchStudentGrades]);

  useEffect(() => {
    if (selectedTeacherId) {
      fetchTeacherProfile(selectedTeacherId);
    } else {
      setActiveTeacherProfile(null);
    }
  }, [selectedTeacherId, fetchTeacherProfile]);

  return {
    selectedStudent,
    setSelectedStudent,
    selectedTeacherId,
    setSelectedTeacherId,
    studentGradesDetail,
    studentGradesLoading,
    activeTeacherProfile,
    teacherProfileLoading
  };
}
