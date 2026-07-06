"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DashboardContextType {
  // Global Year & Semester Filters
  year: number;
  setYear: (year: number) => void;
  semester: "Намар" | "Хавар";
  setSemester: (sem: "Намар" | "Хавар") => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  // Global filter state
  const [year, setYear] = useState(2024); // Start with 2024 as default in postman
  const [semester, setSemester] = useState<"Намар" | "Хавар">("Хавар");

  return (
    <DashboardContext.Provider
      value={{
        year,
        setYear,
        semester,
        setSemester
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
