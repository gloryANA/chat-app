// models/Message.ts
// src/models/Message.ts
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  content: String,
  sender: String,
  recipient: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export default Message;

