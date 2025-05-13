import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';

export interface AuthRequest extends Request {
  user?: any;
}

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const user = await registerUser(req);
    res.status(201).json({ message: 'User registered', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
