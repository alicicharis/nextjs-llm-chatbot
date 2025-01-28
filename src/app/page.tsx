'use client';

import { FormEvent, useRef, useState } from 'react';
import { QuestionResponse } from '@/types';

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        question: inputRef.current?.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: QuestionResponse = await res.json();

    setResponses((prev) => [...prev, data]);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-700">
      <div className="flex-1 p-4 w-[600px] space-y-8">
        {responses?.map((response) => (
          <div className="space-y-4" key={response.id}>
            <p className="text-lg font-semibold">
              Question: {response.question}
            </p>
            <p className="text-base font-medium">{response.answer}</p>
            <div className="w-full h-[0.5px] bg-gray-500"></div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-5 w-[600px] bg-gray-200 rounded-lg border-t border-gray-300 p-4">
        <form className="flex gap-2" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask something"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="text-white bg-black px-10 font-semibold rounded-lg"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
