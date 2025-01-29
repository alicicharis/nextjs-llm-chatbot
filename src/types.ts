import { MessageContent } from '@langchain/core/messages';

export type Chat = {
  id: string;
  content: MessageContent;
  type: 'human' | 'ai';
  createdAt: number;
};
