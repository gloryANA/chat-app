import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db'; // Adjust path as necessary
import User from '../../../../../models/User'; // Adjust path as necessary

export async function POST(req: NextRequest) {
  try {
    const { userId, friendUsername } = await req.json();
    
    // Connect to the database
    await dbConnect();
    
    // Find the current user
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User not found: ${userId}`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Find the friend by username
    const friend = await User.findOne({ username: friendUsername }); // Ensure correct field name
    if (!friend) {
      console.error(`Friend not found: ${friendUsername}`);
      return NextResponse.json({ message: 'Friend not found' }, { status: 404 });
    }
    
    // Add the friend to the current user's friends list
    if (!user.friends.includes(friend._id)) {
      user.friends.push(friend._id);
      await user.save();
    }
    
    // Add the current user to the friend's friends list
    if (!friend.friends.includes(user._id)) {
      friend.friends.push(user._id);
      await friend.save();
    }

    return NextResponse.json({ message: 'Friend added successfully', friend: friend.username });
  } catch (error) {
    console.error('Error adding friend:', error);
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 });
  }
}
