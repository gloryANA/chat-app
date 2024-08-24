// // lib/authOptions.ts
// import CredentialsProvider from "next-auth/providers/credentials";
// import dbConnect from "../lib/db"; // Ensure correct import path
// import User from "../models/User";
// import bcrypt from "bcryptjs";
// import type { NextAuthOptions } from "next-auth";

// // Define the credentials type
// interface Credentials {
//   email: string;
//   password: string;
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       credentials: {
//         email: { label: 'Email', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials: Credentials | undefined) {
//         if (!credentials) {
//           throw new Error('No credentials provided');
//         }

//         // Connect to the database
//         await dbConnect();

//         // Find the user by email
//         const user = await User.findOne({ email: credentials.email });

//         if (!user) {
//           throw new Error('No user found');
//         }

//         // Validate the password
//         const isValid = await bcrypt.compare(credentials.password, user.password);
//         if (!isValid) {
//           throw new Error('Incorrect password');
//         }

//         // Return the user object
//         return {
//           email: user.email,
//           name: user.name,
//           id: user._id.toString(), // Ensure you return an id
//         };
//       },
//     }),
//   ],
//   session: {
//     strategy: "jwt", // Ensure this matches the expected type
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/signin",
//   },
// };
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../lib/db';
import User from '../models/User';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface User {
    username?: string; // Add the username field here
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      username?: string; // Add the username field to the session user
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }

        await dbConnect();

        const user = await User.findOne({ username: credentials.username });

        if (!user) {
          throw new Error('No user found');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username, // Include username in the returned user object
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string; // Assign the username to session
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username; // Assign the username to the token
      }
      return token;
    },
  },
};
