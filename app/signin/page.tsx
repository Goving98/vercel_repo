// app/signin/page.tsx
"use client"
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center h-full">
      <h1>Sign In</h1>
    </div>
  );
}
