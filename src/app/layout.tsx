"use client";

import "./globals.css"; // 👈 THIS IS THE MISSING LINK!
import { Inter } from "next/font/google"; // Standard Next.js font
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import QueryProvider from "@/providers/QueryProvider";
import { Suspense } from "react";
// import { title } from "process";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const publicPages = ["/login", "/register"];

    if (!userId && !publicPages.includes(pathname)) {
      router.push("/login");
    }
  }, [pathname, router]);

  const isPublicPage = ["/login", "/register"].includes(pathname);

  return (
    <html lang="en">
      {/* Add the font class here to keep typography clean */}
      <title>TraceBack</title>
      <body className={inter.className}> 
        <QueryProvider>
          {/* Wrap the Navbar in its own Suspense boundary */}
        
          {!isPublicPage && <Suspense fallback={<div className="h-16 bg-white border-b" />}>
          <Navbar />
        </Suspense>}
          {/* We use a main container to ensure content doesn't hide behind the sticky Navbar */}
          <main>
            {children}
          </main>
          <Toaster position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
}