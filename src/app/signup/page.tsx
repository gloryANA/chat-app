// "use client";  

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
// import { FormEvent } from "react";

// export default function Signup() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     const res = await fetch("/api/auth/signup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password, name }),
//     });

//     if (res.ok) {
//       const signInResult = await signIn("credentials", {
//         redirect: false,
//         username: name,
//         password,
//       });
//       console.log('SignIn Result:', signInResult);
//       if (signInResult?.ok) {
//         router.push("/chat"); // Redirect to the chat interface after successful signup and login
//       } else {
//         console.error("Sign in after signup failed");
//       }
//     } else {
//       console.error("Signup failed");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-900">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md max-w-md w-full">
//         <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
//         <div className="mb-4">
//           <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//         </div>
//         <div className="mb-6">
//           <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full p-2 border border-gray-300 rounded"
//           />
//         </div>
//         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// }



"use client";  

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserame] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    });
  
    const data = await res.json();  // Parse the response data
  
    if (res.ok) {
      await signIn("credentials", {
        redirect: false,
        username,
        password,
      });
      router.push("/chat");
    } else {
      console.error("Signup failed:", data.error);  // Display error message
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUserame(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Sign Up
        </button>
      </form>
    </div>
  );
}