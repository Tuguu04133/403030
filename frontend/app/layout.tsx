import type { Metadata } from "next";
import "./globals.css";
import { DashboardProvider } from "./context/DashboardContext";
import LayoutWrapper from "./components/layout-wrapper";

export const metadata: Metadata = {
  title: "GradPulse - Диплом Хамгаалалтын Аналитик",
  description: "Төгсөлтийн ажил хамгаалалтын комиссын дүнгийн аналитик систем",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg-cool">
        <DashboardProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </DashboardProvider>
      </body>
    </html>
  );
}

