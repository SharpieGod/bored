import "~/styles/globals.css";

import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "bored",
  description: "A board for bored students",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body className="h-screen bg-background-950 text-lg text-text-50">
        <Toaster theme="dark" />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
