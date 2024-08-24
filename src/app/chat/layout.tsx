// app/chat/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/authOptions";
import ChatClient from "./ChatClient"; // Import the Client Component

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/signin");
  }

  return (
    <ChatClient session={session}>
      {children}
    </ChatClient>
  );
}
