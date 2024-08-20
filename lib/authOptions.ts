// lib/authOptions.ts
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../lib/db"; // Ensure correct import path
import User from "../models/User";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

// Define the credentials type
interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        // Connect to the database
        await dbConnect();

        // Find the user by email
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found');
        }

        // Validate the password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password');
        }

        // Return the user object
        return {
          email: user.email,
          name: user.name,
          id: user._id.toString(), // Ensure you return an id
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Ensure this matches the expected type
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};
