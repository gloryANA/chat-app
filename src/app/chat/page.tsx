'use client';
import { useState, useEffect } from 'react';
import React from 'react';
import io, { Socket } from 'socket.io-client';
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from './Chat.module.css';

interface Message {
  content: string;
  sender: string;
}

interface ChatPanelProps {
  selectedChat: string | null;
  messages: Message[];
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

const socket: Socket = io();

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState<string[]>([]);
  const [friendUsername, setFriendUsername] = useState('');

  const fetchChats = async () => {
    try {
      if (!session?.user?.email) return; // Ensure user is logged in

      const response = await fetch(`/api/chats?email=${session.user.email}`);
      const data = await response.json();
      
      console.log('Fetched chats:', data); // Debugging statement

      if (Array.isArray(data)) {
        setChats(data.map((chat) => chat.participants.find((p) => p !== session.user.email)));
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // const fetchChats = async () => {
  //   try {
  //     if (!session?.user?.email) return; // Ensure user is logged in
  
  //     const response = await fetch(`/api/chats?email=${session.user.email}`);
  //     const data = await response.json();
  
  //     console.log('Fetched chats:', data); // Debugging statement
  
  //     if (Array.isArray(data)) {
  //       const filteredChats = data.map((chat) =>
  //         chat.participants.find((p) => p !== session.user.email)
  //       );
  
  //       console.log('Filtered chats:', filteredChats); // Debugging statement
  
  //       setChats(filteredChats);
  //     } else {
  //       console.error('Unexpected data format:', data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching chats:', error);
  //   }
  // };
  

  useEffect(() => {
    if (status === 'loading' || !session?.user) return;

    fetchChats(); // Fetch chats when the session is loaded or user changes
  }, [session, status]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      signIn();
      return;
    }

    socket.on('message', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [session, status]);

  useEffect(() => {
    console.log('Chats state:', chats); // Debugging statement
  }, [chats]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user || !selectedChat) return;

    socket.emit('message', { content: message, sender: session.user.username, receiver: selectedChat });

    try {
      await fetch('/api/chats/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message, sender: session.user.username, receiver: selectedChat }),
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }

    setMessage('');
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    setMessages([]); // Fetch and set messages for the selected chat
  };

  const handleAddFriend = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch('/api/friends/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id, friendUsername }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.friend) {
          setChats((prevChats) => [...prevChats, result.friend]);
          setFriendUsername('');
          // await fetchChats(); // Call the function to update chats
        } else {
          alert(result.message || 'User not found or already added.');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add friend.');
      }
    } catch (error) {
      console.error('Error adding friend:', error);
      alert('Failed to add friend.');
    }
  };

  return (
    <div className="flex h-screen">
      <SidePanel 
        chats={chats} 
        onSelectChat={handleChatSelect} 
        session={session} 
        onSignOut={signOut}
        onAddFriend={handleAddFriend}
        friendUsername={friendUsername}
        onFriendUsernameChange={(e) => setFriendUsername(e.target.value)}
      />
      <ChatPanel 
        selectedChat={selectedChat} 
        messages={messages} 
        message={message} 
        onMessageChange={(e) => setMessage(e.target.value)} 
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

function SidePanel({ chats, onSelectChat, session, onSignOut, onAddFriend, friendUsername, onFriendUsernameChange }) {
  return (
    <div className="w-1/3 bg-gray-800 text-white flex flex-col h-screen">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold mb-2">Overview</h2>
        <h3 className="text-lg  mb-2">Add Friends</h3>
        <div className="mb-4">
          <input
            type="text"
            value={friendUsername}
            onChange={onFriendUsernameChange}
            placeholder="Enter username"
            className="border p-2 w-full mb-2 text-black"
          />
          <button 
            onClick={onAddFriend}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Friend
          </button>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li 
              key={chat} 
              onClick={() => onSelectChat(chat)} 
              className="cursor-pointer hover:bg-gray-700 p-2 rounded"
            >
              {chat}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-700 flex items-center justify-between">
        <div>
          <div className="font-semibold">
            {session.user.username ? session.user.username : 'Username not available'}
          </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

function ChatPanel({
  selectedChat,
  messages,
  message,
  onMessageChange,
  onSendMessage,
}: ChatPanelProps) {
  return (
    <div className={styles.chatPanel}>
      <div className={styles.messages}>
        {selectedChat ? (
          <>
            <div className={styles.chatHeader}>
              <h2 className="text-xl font-bold">{selectedChat}</h2>
            </div>
            <div className={styles.messagesList}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${styles.messageBubble} ${
                    msg.sender === 'you' ? styles.messageBubbleYou : styles.messageBubbleOther
                  }`}
                >
                  <div>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={onSendMessage} className={styles.messageForm}>
              <input
                type="text"
                value={message}
                onChange={onMessageChange}
                required
                className={styles.messageInput}
                placeholder="Type a message"
              />
              <button
                type="submit"
                className={styles.sendButton}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className={styles.noChats}>
            There are no chats at the moment
          </div>
        )}
      </div>
    </div>
  );
}
