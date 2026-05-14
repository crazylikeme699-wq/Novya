import React, { useState, useRef, useEffect } from 'react';
import { ScreenType } from './PhoneWrapper';
import { ChevronLeft, Send, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useStore } from '../store';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AICoach({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const tasks = useStore(state => state.tasks);
  const allCompleted = tasks.length > 0 && tasks.every(t => t.completed);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey. I noticed you've been delaying some tasks. What's stopping you today? Let's break it down."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Build history for the chat
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const systemPrompt = `You are an AI Coach, a highly motivating, friendly, and intelligent assistant acting like ChatGPT or Gemini. 
      RULES:
      1. Be deeply conversational, empathetic, and highly motivating.
      2. Respond in whatever language the user speaks to you in natively and fluently.
      3. Do not just say "cheers" or be repetitive—offer actual, thoughtful advice or insight to help them succeed.
      4. Encourage them and act as their absolute best cheerleader while providing practical productivity advice.
      5. User's task completion status: ${allCompleted ? "ALL TASKS COMPLETED" : "TASKS PENDING"}. If tasks are completed, celebrate their success meaningfully!
      6. CRITICAL: Keep your responses extremely short. No more than 1 or 2 small sentences. Be very punchy and direct, while still being extremely friendly.`;

      // Filter to ensure correct alternation or just let history pass as is. 
      // If the first message in the sliced history is 'model', and we prepend it, it should alternate with the new 'user' message.
      // But we can simplify by just using systemInstruction.
      let validHistory = [...history];
      if (validHistory.length > 0 && validHistory[0].role === 'model') {
        validHistory = [{ role: 'user', parts: [{ text: "Hello" }] }, ...validHistory];
      }
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...validHistory,
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
          maxOutputTokens: 150,
        }
      });

      if (response.text) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: response.text }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "I'm having trouble connecting to my brain. Try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between border-b border-white/5 bg-black/80 backdrop-blur z-10">
        <button onClick={() => onNavigate('launcher')} className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
           <Sparkles className="w-4 h-4 text-blue-400" />
           <span className="text-sm font-semibold tracking-widest uppercase text-white">AI Coach</span>
        </div>
        <div className="w-6"></div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-neutral-800 text-white rounded-br-sm' 
                : 'bg-blue-900/20 text-blue-50 border border-blue-500/20 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-blue-900/20 border border-blue-500/20 rounded-2xl rounded-bl-sm px-5 py-3.5">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent">
        <form onSubmit={handleSend} className="relative flex items-center bg-neutral-900 rounded-2xl border border-neutral-800 focus-within:border-neutral-600 transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your excuse..."
            className="flex-1 bg-transparent text-sm text-white placeholder-neutral-600 px-5 py-4 outline-none font-medium"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading} 
            className="p-3 mr-1 text-neutral-400 hover:text-white disabled:opacity-50 transition-colors"
          >
             <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
