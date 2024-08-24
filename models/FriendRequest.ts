import mongoose, { Schema, Document } from 'mongoose';

interface IFriendRequest extends Document {
  sender: string;
  recipient: string;
}

const FriendRequestSchema: Schema = new Schema(
  {
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.FriendRequest || mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);
