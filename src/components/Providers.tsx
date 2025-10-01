"use client";

import { AuthProvider } from "@getmocha/users-service/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
