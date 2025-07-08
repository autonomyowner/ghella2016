import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "الغلة - السوق الزراعي الرقمي",
  description: "منصة رقمية متخصصة في بيع وشراء المعدات الزراعية والأراضي الزراعية في المملكة العربية السعودية",
  keywords: "معدات زراعية, أراضي زراعية, جرارات, حصادات, مزارع, السعودية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-right`}
      >
        <AuthProvider>
          <Header />
          <main className="pb-16 lg:pb-0">{children}</main>
          <BottomNav />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
