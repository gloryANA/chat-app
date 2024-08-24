// src/app/components/AddFriend.tsx
import { useState } from 'react';

export default function AddFriend() {
  const [email, setEmail] = useState('');

  const handleAddFriend = async () => {
    try {
      const response = await fetch('/api/friends/friend-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: email }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
        // Optionally update UI or state
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter friend's email"
      />
      <button onClick={handleAddFriend}>Add Friend</button>
    </div>
  );
}
