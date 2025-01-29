'use client';

import { FormEvent, useRef, useState } from 'react';
import { Chat } from '@/types';
import { Bot, Loader2, User } from 'lucide-react';

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [chat, setChat] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent): Promise<void> => {
    if (loading) return;

    e.preventDefault();
    setLoading(true);

    const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/ask', {
      method: 'POST',
      body: JSON.stringify({
        question: inputRef.current?.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: { chat: Chat[] } = await res.json();

    setChat(data?.chat);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-700">
      <div className="flex-1 p-4 w-[600px] overflow-y-auto max-h-[85vh] mb-auto mt-5 custom-scrollbar">
        {chat?.length > 0 ? (
          chat?.map((message, i) => {
            if (message?.type === 'human') {
              return (
                <div className="space-y-4" key={message?.id}>
                  {i > 0 && i !== chat.length - 1 && (
                    <div className="w-full h-[0.5px] bg-gray-500"></div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-black rounded-full">
                      <User size={24} className="text-whit" />
                    </div>
                    <p className="text-base font-medium">
                      {message?.content?.toString()}
                    </p>
                  </div>
                  <div className="w-full h-[0.5px] bg-gray-500"></div>
                </div>
              );
            }

            if (message?.type === 'ai') {
              return (
                <div key={message?.id} className="flex items-center gap-2 my-4">
                  <div className="p-2 bg-black rounded-full">
                    <Bot
                      size={24}
                      className="text-white bg-black rounded-full"
                    />
                  </div>
                  <p className="text-base font-medium">
                    {message?.content?.toString()}
                  </p>
                </div>
              );
            }
          })
        ) : (
          <p>Ask anything you want to know</p>
        )}
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
            disabled={loading}
            className={`text-white w-48 flex justify-center items-center font-semibold rounded-lg ${
              loading ? 'bg-gray-500' : 'bg-black'
            }`}
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Ask'}
          </button>
        </form>
      </div>
    </div>
  );
}
