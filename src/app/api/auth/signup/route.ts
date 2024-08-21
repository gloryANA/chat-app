import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '../../../../../models/User'; // Adjust path
import dbConnect from '../../../../../lib/db'; // Adjust path

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, email, password } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
