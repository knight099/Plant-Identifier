/* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { getChatResponse } from '@/lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  plantInfo: any;
  initialMessage?: string;
}

// export default function ChatInterface: React.FC<ChatInterfaceProps> = ({ plantInfo, initialMessage }) => {
const  ChatInterface: React.FC<ChatInterfaceProps> = ({ plantInfo, initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (initialMessage) {
      setMessages([{ content: initialMessage, role: 'assistant' }]);
    }
  }, [initialMessage]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: input },
    ];
    setMessages(newMessages);
    setInput('');

    // Call Gemini API for chat response
    const response = await getChatResponse(input, plantInfo);
    setMessages([...newMessages, { role: 'assistant', content: response }]);
  };

  return (
    <div className="w-full max-w-xl bg-gradient-to-r from-green-200 via-white to-blue-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-xl overflow-hidden">
      {/* Chat Window */}
      <div className="h-96 overflow-y-auto p-6 bg-white dark:bg-gray-800">
        {messages.map((message, index) => (
        <div key={index} className={`message ${message.role}`}>
          {message.content}
        </div>
      ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Start a conversation about your plant 🌱
          </p>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-sm p-3 rounded-xl text-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about your plant..."
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-200 flex items-center justify-center"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
