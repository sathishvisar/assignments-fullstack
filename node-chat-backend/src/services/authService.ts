import User from '../models/User';
import { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface LoginResult {
  token: string;
  user: IUser;
}

export const registerUser = async (req: any) => {
  const { firstname, lastname, email, password } = req.body;

  const existing = await User.findOne({ email});
  if (existing) throw new Error('Email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ firstname, lastname, email, password: hashedPassword });
  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });

  return { token, user };
};
