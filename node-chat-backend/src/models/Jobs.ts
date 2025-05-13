import { Schema, model } from 'mongoose';

export interface IJob {
  company: string;
  title: string;
  location: string;
  jobType: 'Full Time' | 'Part Time' | 'Contract';
  visaSponsorship?: 'Available' | 'Not Available';
  remoteWorkPolicy: string;
  relocation?: boolean;
  experience?: string;
  skills?: string[];
  benefits?: string[];
  description?: string;
  hiringProcess?: string[];
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  createdAt?: Date;
}

const jobSchema = new Schema<IJob>({
  company: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  jobType: { type: String, enum: ['Full Time', 'Part Time', 'Contract'], required: true },
  visaSponsorship: { type: String, enum: ['Available', 'Not Available'], default: 'Not Available' },
  remoteWorkPolicy: { type: String, required: true },
  relocation: { type: Boolean, default: false },
  experience: { type: String },
  skills: [{ type: String }],
  benefits: [{ type: String }],
  description: { type: String },
  hiringProcess: [{ type: String }],
  salary: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: 'INR' },
  },
  createdAt: { type: Date, default: Date.now },
});

export default model<IJob>('Job', jobSchema);
