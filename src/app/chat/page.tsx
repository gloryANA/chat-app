'use client';
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useSession, signIn } from 'next-auth/react';

interface Message {
  content: string;
  sender: string;
}

const socket: Socket = io();

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    if (!session?.user) {
      signIn(); // Redirect to sign-in if not authenticated
      return;
    }

    socket.on('message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      console.log('Not logged in');
      return;
    }
    socket.emit('message', { content: message, sender: session.user.email });
    setMessage('');
  };

  if (!session?.user) {
    return <div>Loading...</div>; // Display loading state while redirecting
  }

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.sender}: {msg.content}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required 
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
