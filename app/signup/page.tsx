// app/signout/page.tsx
"use client"
import { signOut } from "next-auth/react";
import React from "react";

export default function SignOut() {
  return (
    <div className="flex items-center justify-center h-full">
      <h1>Sign Out</h1>
    </div>
  );
}
