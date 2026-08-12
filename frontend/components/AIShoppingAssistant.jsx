import React, { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';

export default function AIShoppingAssistant({ catalog = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your BabyBloom AI Assistant. Looking for clothing or nursery items under ₹2000?' }
  ]);

  const handleSend = () => {
    if (!query.trim()) return;

    const userMessage = query.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setQuery('');

    setTimeout(() => {
      const lower = userMessage.toLowerCase();
      const matches = catalog.filter((item) => 
        item.name.toLowerCase().includes(lower) || item.category?.toLowerCase().includes(lower)
      );

      let botReply = "I couldn't find an exact match in our store. Try searching for 'shoes', 'toys', or 'blankets'!";
      if (matches.length > 0) {
        botReply = `Here are top matches for you:\n` + matches.slice(0, 3).map((m) => `• ${m.name} - ₹${m.discounted_price}`).join('\n');
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white py-3 px-5 rounded-full shadow-2xl transition-all hover:scale-105"
        >
          <Bot className="w-5 h-5"/>
          <span className="font-bold text-xs tracking-wide">Ask ShopAI</span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[480px]">
          <div className="bg-rose-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5"/>
              <h4 className="font-bold text-sm">BabyBloom ShopAI</h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5"/>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                  m.sender === 'user' ? 'bg-rose-500 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm border rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border-t flex items-center gap-2">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for recommendations..."
              className="flex-1 text-xs border rounded-xl py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button onClick={handleSend} className="bg-rose-500 text-white p-2.5 rounded-xl">
              <Send className="w-4 h-4"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}