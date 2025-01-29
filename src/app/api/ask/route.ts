import { Chat } from '@/types';
import { invokeLlm, invokeChat } from '@/lang-chain';
import { v4 as uuidv4 } from 'uuid';
import { AIMessage, HumanMessage } from '@langchain/core/messages';

export async function POST(request: Request) {
  const { question }: { question: string } = await request.json();

  const llmResponse = await invokeChat(question);

  const chat: Chat[] = [];
  llmResponse.forEach((message) => {
    if (message instanceof HumanMessage) {
      chat.push({
        id: uuidv4(),
        content: message.content,
        type: 'human',
        createdAt: new Date().getTime(),
      });
    }

    if (message instanceof AIMessage) {
      chat.push({
        id: uuidv4(),
        content: message.content,
        type: 'ai',
        createdAt: new Date().getTime(),
      });
    }
  });

  return new Response(JSON.stringify({ chat }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
