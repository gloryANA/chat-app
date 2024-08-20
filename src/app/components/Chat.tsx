"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import socket from '../utils/socket';

const ChatContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const MessageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const MessageItem = styled.li`
  padding: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
`;

const ChatForm = styled.form`
  display: flex;
  margin-top: 20px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ChatButton = styled.button`
  padding: 10px;
  margin-left: 10px;
  border: none;
  background-color: #0070f3;
  color: white;
  border-radius: 5px;
`;

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('chat message', input);
      setInput('');
    }
  };

  return (
    <ChatContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <MessageItem key={index}>{msg}</MessageItem>
        ))}
      </MessageList>
      <ChatForm onSubmit={sendMessage}>
        <ChatInput
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <ChatButton type="submit">Send</ChatButton>
      </ChatForm>
    </ChatContainer>
  );
};

export default Chat;
