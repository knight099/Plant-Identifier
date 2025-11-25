/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { getChatResponse } from '@/lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  error?: boolean;
}

interface ChatInterfaceProps {
  plantInfo: any;
  initialMessage?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ plantInfo, initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested questions based on plant info
  const suggestedQuestions = [
    "How often should I water this plant?",
    "What are the ideal light conditions?",
    "What type of soil is best?",
    "How do I propagate this plant?",
  ];

  useEffect(() => {
    if (initialMessage) {
      setMessages([{ content: initialMessage, role: 'assistant', timestamp: new Date() }]);
    }
  }, [initialMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    setError(null);
    const userMessage: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Call Gemini API for chat response
      const response = await getChatResponse(textToSend, plantInfo);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: response, timestamp: new Date() },
      ]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
          error: true,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const retryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      // Remove the error message
      setMessages(messages.filter(m => !m.error));
      sendMessage(lastUserMessage.content);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <Sparkles className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Plant Assistant</h3>
          <p className="text-white/80 text-xs">Ask me anything about {plantInfo?.name || 'your plant'}</p>
        </div>
      </div>

      {/* Chat Window */}
      <div className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 scroll-smooth">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="text-green-600 dark:text-green-400" size={32} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start a conversation about your plant 🌱
            </p>
            {/* Suggested Questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(question)}
                  className="text-xs sm:text-sm p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:shadow-md transition-all duration-200 text-left text-gray-700 dark:text-gray-300"
                  aria-label={`Ask: ${question}`}
                >
                  💡 {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
          >
            <div className={`flex gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.error
                      ? 'bg-red-100 dark:bg-red-900/30'
                      : 'bg-green-100 dark:bg-green-900/30'
                  }`}
              >
                {message.role === 'user' ? (
                  <span className="text-sm font-semibold">You</span>
                ) : message.error ? (
                  <AlertCircle className="text-red-600 dark:text-red-400" size={16} />
                ) : (
                  <Sparkles className="text-green-600 dark:text-green-400" size={16} />
                )}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col">
                <div
                  className={`p-3 rounded-2xl text-sm shadow-md ${message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : message.error
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-tl-sm border border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-sm border border-gray-200 dark:border-gray-600'
                    }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                <span className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="mb-4 flex justify-start animate-fade-in">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="text-green-600 dark:text-green-400" size={16} />
              </div>
              <div className="bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-tl-sm shadow-md border border-gray-200 dark:border-gray-600">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error with Retry */}
        {error && (
          <div className="mb-4 flex justify-center">
            <button
              onClick={retryLastMessage}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <RefreshCw size={16} />
              <span className="text-sm">Retry</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your plant..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label="Chat message input"
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
