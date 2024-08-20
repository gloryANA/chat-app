// app/chat/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function Chat() {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io();
    socket.on("message", (msg) => setMessages((prev) => [...prev, msg]));
  }, []);

  const sendMessage = () => {
    socket.emit("message", { sender: session.user.email, content: message });
    setMessage("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>
            {msg.sender}: {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
