// src/types/next-auth.d.ts

import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Add this line to include `id`
      username?: string;
      email?: string;
      image?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    username?: string; // Add username to the JWT token
  }
}

