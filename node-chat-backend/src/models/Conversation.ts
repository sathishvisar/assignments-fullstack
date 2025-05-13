import { Schema, model, Types } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface IConversation {
  userId: Types.ObjectId;
  jobId: Types.ObjectId;
  messages: IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema<IMessage>({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const conversationSchema = new Schema<IConversation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  messages: [messageSchema],
}, { timestamps: true });

export default model<IConversation>('Conversation', conversationSchema);
