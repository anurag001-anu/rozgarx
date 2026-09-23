import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RozgarX - Find Your Next Opportunity",
  description: "A premium job portal for Government and Private jobs in India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-transparent flex flex-col relative`}>
        {/* Global Background Elements */}
        <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none flex justify-center">
           {/* Floating Glowing Orbs */}
           <div className="absolute top-[5%] right-[15%] w-[400px] h-[400px] bg-blue-400/30 rounded-full blur-[100px] mix-blend-multiply animate-pulse"></div>
           <div className="absolute top-[70%] left-[10%] w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDelay: "1s" }}></div>
           <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-indigo-400/15 rounded-full blur-[80px] mix-blend-multiply animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
