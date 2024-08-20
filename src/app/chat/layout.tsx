// app/chat/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/authOptions";

export default async function ChatLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      {children}
    </div>
  );
}
