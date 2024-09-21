// app/Components/AuthCheck.tsx
"use client"; // This tells Next.js that it's a Client Component

import { useSession } from "next-auth/react";

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  if (!session) {
    // Show login or some other UI when not authenticated
    return <p>You must be logged in to view this content.</p>;
  }

  return <>{children}</>;
}
