import { Schema, model } from 'mongoose';

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

const userSchema = new Schema<IUser>({
  firstname: { type: String, unique: false, required: true },
  lastname: { type: String, unique: false, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

export default model<IUser>('User', userSchema);
