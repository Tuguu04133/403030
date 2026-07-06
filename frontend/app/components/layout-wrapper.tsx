"use client";

import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-bg-cool min-h-screen text-gray-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header bar with filters */}
        <Header />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
