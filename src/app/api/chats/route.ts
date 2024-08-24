import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Chat from '../../../../models/Chat';

export async function GET(req: NextRequest) {
  try {
    // Assuming user authentication/session handling is done elsewhere
    const userEmail = req.nextUrl.searchParams.get('email');

    if (!userEmail) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const chats = await Chat.find({ participants: userEmail }).sort({ updatedAt: -1 });

    return NextResponse.json(chats, { status: 200 });

  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ message: 'Error fetching chats', error }, { status: 500 });
  }
}


// src/app/api/chats/route.ts
// import { NextResponse } from 'next/server';
// import { MongoClient } from 'mongodb';

// const client = new MongoClient(process.env.MONGODB_URI);

// export async function GET(request: Request) {
//   try {
//     const email = new URL(request.url).searchParams.get('email');
//     if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

//     await client.connect();
//     const db = client.db('users');
//     const chats = await db.collection('chats').find({ participants: email }).toArray();

//     console.log('Fetched chats from database:', chats); // Debugging statement

//     return NextResponse.json(chats);
//   } catch (error) {
//     console.error('Error fetching chats:', error);
//     return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
//   } finally {
//     await client.close();
//   }
// }

