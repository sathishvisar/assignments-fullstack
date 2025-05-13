// src/types/message.ts
export type MessageRole = 'user' | 'assistant';

export interface IMessage {
  _id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  socketId?: string;
  jobId?: string;
  userId?: string;
}