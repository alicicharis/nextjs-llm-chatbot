import { QuestionResponse } from '@/types';

export async function POST(request: Request) {
  const { question }: { question: string } = await request.json();

  const uuid: string = crypto.randomUUID();
  const questionResponse: QuestionResponse = {
    id: uuid,
    question,
    answer: 'Paris',
    createdAt: new Date().getTime(),
  };

  return new Response(JSON.stringify(questionResponse), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
