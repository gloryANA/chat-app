// app/chat/ChatClient.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function ChatClient({ session, children }: { session: Session; children: React.ReactNode }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
