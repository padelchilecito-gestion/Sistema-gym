import React, { useState, useRef, useEffect } from 'react';
import { Transaction, Client } from '../types';
import { analyzeFinancialData } from '../services/geminiService';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  transactions: Transaction[];
  clients: Client[];
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ transactions, clients }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hola, soy tu asistente financiero inteligente. ¿En qué puedo ayudarte hoy? Puedo analizar tendencias de ingresos, deudas de clientes o resumir tu estado financiero.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await analyzeFinancialData(transactions, clients, userMessage.text);

    const aiMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'ai',
      text: aiResponseText
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] md:h-[800px] max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden m-4 md:m-6">
      {/* Header */}
      <div className="bg-indigo-600 p-4 flex items-center gap-3 text-white">
        <div className="p-2 bg-indigo-500 rounded-lg">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg">Asistente GymFlow AI</h3>
          <p className="text-indigo-200 text-xs">Powered by Gemini 2.5 Flash</p>
        </div>
        <Sparkles className="ml-auto text-indigo-300 opacity-50" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm whitespace-pre-wrap text-sm leading-relaxed
              ${msg.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
               <Loader2 size={16} className="animate-spin text-indigo-600" />
               <span className="text-slate-500 text-sm">Analizando datos...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Pregunta sobre tus finanzas (ej: ¿Quién debe dinero?)"
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};