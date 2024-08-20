// src/app/page.tsx
"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-white text-4xl mb-8">Welcome to the Chat App</h1>
        <div className="space-x-4">
          <Link href="/signin">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
              Signup
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
