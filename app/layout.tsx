"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import GlobalStyleProvider from "./providers/GlobalStyleProvider";
import { GlobalProvider } from "./context/globalProvider";
import { useSession, signIn, signOut } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import AuthCheck from "./Components/AuthCheck";
import ContextProvider from "./providers/ContextProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const {userId} = auth()
  // const { data: session } = useSession();
  return (
    // <SessionProvider>
      <html lang="en">
        <head>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
              integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ContextProvider>
        <GlobalStyleProvider>
        <GlobalProvider>
            <Sidebar />
            <div className="w-full">{children}</div>
          </GlobalProvider>
        </GlobalStyleProvider>
        </ContextProvider>
        </body>
      </html>
      // </SessionProvider>
  );
}
