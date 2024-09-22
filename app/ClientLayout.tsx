"use client";

import { SessionProvider } from "next-auth/react";
import ContextProvider from "./providers/ContextProvider";
import GlobalStyleProvider from "./providers/GlobalStyleProvider";
import Sidebar from "./Components/Sidebar/Sidebar";
import NextTopLoader from "nextjs-toploader";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextTopLoader
        height={2}
        color="#27AE60"
        easing="cubic-bezier(0.53,0.21,0,1)"
      />
      <ContextProvider>
        <GlobalStyleProvider>
          <Sidebar />
          <div className="w-full">{children}</div>
        </GlobalStyleProvider>
      </ContextProvider>
    </SessionProvider>
  );
}
