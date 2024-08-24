import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Chat from '../../../../../models/Chat';

export async function POST(req: NextRequest) {
  try {
    const { content, sender, chatId } = await req.json();
    
    await dbConnect();

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return NextResponse.json({ message: 'Chat not found' }, { status: 404 });
    }

    chat.messages.push({ content, sender, timestamp: new Date() });
    await chat.save();

    return NextResponse.json({ message: 'Message saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ message: 'Error saving message', error }, { status: 500 });
  }
}
