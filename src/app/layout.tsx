import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast"; // The Apple-style popups!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Traceback | Lost & Found",
  description: "Find what you lost, return what you found.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {/* We wrap the app so React Query works everywhere */}
        <QueryProvider>
          {children}
          {/* We put the Toaster here so notifications can pop up on any page */}
          <Toaster position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
}