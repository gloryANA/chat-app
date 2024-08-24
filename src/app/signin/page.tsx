// // "use client";

// // import { signIn } from "next-auth/react";
// // import { useRouter } from "next/navigation";
// // import { useState, FormEvent } from "react";
// // import User from '../../../models/User'; // Adjust path
// // import dbConnect from '../../../lib/db'; // Adjust path
// // import bcrypt from 'bcryptjs';

// // export default function SignIn() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const router = useRouter();

// //   const handleSubmit = async (e: FormEvent) => {
// //     e.preventDefault();
// //     await dbConnect();

// //     console.log(email, password);

// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       console.log("no user");
// //       return; // Return here instead of 0
// //     }

// //     // Check if the password matches
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       console.log('Invalid password');
// //       return; // Return here instead of 400
// //     }

// //     // Redirect to chat interface after successful sign-in
// //     router.push("/chat");
// //   };

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-900">
// //       <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md max-w-md w-full">
// //         <h1 className="text-2xl font-bold mb-6">Sign In</h1>
// //         <div className="mb-4">
// //           <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
// //           <input
// //             type="email"
// //             id="email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             required
// //             className="w-full p-2 border border-gray-300 rounded"
// //           />
// //         </div>
// //         <div className="mb-6">
// //           <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
// //           <input
// //             type="password"
// //             id="password"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             required
// //             className="w-full p-2 border border-gray-300 rounded"
// //           />
// //         </div>
// //         <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
// //           Sign In
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// "use client";

// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState, FormEvent } from "react";

// export default function SignIn() {
//   const [name, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
  
//     console.log('Username:', name);
//     console.log('Password:', password);
  
//     const result = await signIn("credentials", {
//       redirect: false,
//       username:name, // Use 'username' instead of 'email'
//       password,
//     });
  
//     console.log("Sign In Result:", result);
  
//     if (result?.error) {
//       console.error("Error during sign-in:", result.error);
//       // You can add an alert or error message here for the user
//     } else {
//       router.push("/chat"); // Redirect to chat interface after successful sign-in
//     }
//   };
  

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-900">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md max-w-md w-full">
//         <h1 className="text-2xl font-bold mb-6">Sign In</h1>
//         <div className="mb-4">
//           <label htmlFor="name" className="block text-gray-700 mb-2">Username</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setUsername(e.target.value)}
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
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      username, // Use 'username' instead of 'email'
      password,
    });

    if (result?.error) {
      console.error("Error during sign-in:", result.error);
      // You can add an alert or error message here for the user
    } else {
      router.push("/chat"); // Redirect to chat interface after successful sign-in
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          Sign In
        </button>
      </form>
    </div>
  );
}
