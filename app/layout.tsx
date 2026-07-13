import type { Metadata } from "next";
import { Inter } from "next/font/google";

// @ts-ignore
import "./globals.css";// @ts-ignore
import "katex/dist/katex.min.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "EduIA",
    template: "%s | EduIA",
  },
  description:
    "EduIA is an intelligent AI learning assistant designed for students from primary school to high school.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={inter.variable}
    >
      <body className="h-screen w-screen overflow-hidden bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          <Toaster
            richColors
            position="top-center"
            expand
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}