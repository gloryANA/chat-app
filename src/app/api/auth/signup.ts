// src/app/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import User from ',/../../models/User';
import connectDB from ',/../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB(); // Assuming you have a function to connect to your MongoDB

  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
