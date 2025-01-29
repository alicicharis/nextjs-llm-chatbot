import {
  AIMessageChunk,
  BaseMessage,
  MessageContent,
} from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from '@langchain/langgraph';
import { v4 as uuidv4 } from 'uuid';

const config = { configurable: { thread_id: uuidv4() } };

const llm = new ChatOpenAI({
  model: 'gpt-4o-mini',
  temperature: 0,
});

const callModel = async (
  state: typeof MessagesAnnotation.State
): Promise<{ messages: AIMessageChunk }> => {
  const response = await llm.invoke(state.messages);
  return { messages: response };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode('model', callModel)
  .addEdge(START, 'model')
  .addEdge('model', END);

const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

export const invokeChat = async (text: string): Promise<BaseMessage[]> => {
  const input = [
    {
      role: 'user',
      content: text,
    },
  ];

  const output = await app.invoke({ messages: input }, config);

  return output.messages;
};

export const invokeLlm = async (text: string): Promise<MessageContent> => {
  const res = await llm.invoke([{ role: 'user', content: text }]);

  return res.content;
};
