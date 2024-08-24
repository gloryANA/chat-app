import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Chat from '../../../../../models/Chat';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    const { content, sender, receiver } = await req.json(); // Assuming receiver is passed in the request body
    console.log('content:', content);
    console.log('sender:', sender);
    console.log('receiver:', receiver);

    await dbConnect();

    // Find the chat between the sender and receiver, or create a new one if it doesn't exist
    let chat = await Chat.findOne({
      participants: { $all: [sender, receiver] }
    });

    if (!chat) {
      // Create a new chat if one doesn't exist
      chat = new Chat({ participants: [sender, receiver], messages: [] });
    }

    // Add the new message to the chat
    chat.messages.push({ content, sender, timestamp: new Date() });
    await chat.save();

    return NextResponse.json({ message: 'Message saved successfully', chatId: chat._id }, { status: 200 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ message: 'Error saving message', error: error.message }, { status: 500 });
  }
}
