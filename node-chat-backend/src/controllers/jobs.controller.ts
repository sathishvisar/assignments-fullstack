import { Request, Response } from 'express';
import { ListJobs } from '../services/jobsService';

export const jobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await ListJobs();
    res.status(201).json({ jobs });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
