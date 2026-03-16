"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/providers/QueryProvider";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const publicPages = ["/","/login", "/register"];

    if (!userId && !publicPages.includes(pathname)) {
      router.push("/");
    }
  }, [pathname, router]);

  const isPublicPage = ["/","/login", "/register"].includes(pathname);

  return (
    <html lang="en">
      <title>TraceBack</title>
      <body className={inter.className}> 
        <QueryProvider>
        
          {!isPublicPage && <Suspense fallback={<div className="h-16 bg-white border-b" />}>
          <Navbar />
        </Suspense>}
          <main>
            {children}
          </main>
          <Toaster position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
}