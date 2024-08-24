import mongoose, { Schema, Document } from 'mongoose';

interface IMessage {
  content: string;
  sender: string;
  timestamp: Date;
}

interface IChat extends Document {
  participants: string[];
  messages: IMessage[];
}

const ChatSchema: Schema = new Schema(
  {
    participants: [{ type: String, required: true }],
    messages: [
      {
        content: { type: String, required: true },
        sender: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
