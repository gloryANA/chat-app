// models/User.ts
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Field to store friend IDs
  // other fields
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
