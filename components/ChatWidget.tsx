import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Cpu, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AgentService } from '../services/ai.ts';
import { ChatMessage } from '../types';

export const ChatWidget: React.FC = () => {
  const { state, addOrder, getMenu, getOrder, addLog } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', content: "Welcome to Nexus. I am your Agentic Orchestrator. How can I assist you today? You can ask for recommendations or place an order.", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Initialize Agent Service
  // Note: In a real app, API Key should be managed securely. 
  // Here we assume it's available via env or user input (handled globally usually).
  // For this demo, we will check if it exists in env, else prompt (simulated).
  const agentServiceRef = useRef<AgentService | null>(null);

  useEffect(() => {
    if (process.env.API_KEY) {
        agentServiceRef.current = new AgentService(process.env.API_KEY);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    if (!agentServiceRef.current) {
         setMessages(prev => [...prev, { 
             id: Date.now().toString(), 
             role: 'system', 
             content: "⚠️ API Key missing. Please set process.env.API_KEY to use the AI features.", 
             timestamp: Date.now() 
         }]);
         return;
    }

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    try {
      addLog('Orchestrator', 'Processing', 'Analyzing user intent...', 'thinking');
      
      const response = await agentServiceRef.current.sendMessage(
        messages, 
        userMsg.content,
        {
            getMenu: () => {
                addLog('Menu Agent', 'Fetch', 'Retrieving menu data', 'success');
                return getMenu();
            },
            placeOrder: (name, items) => {
                addLog('Order Agent', 'Action', 'Creating new order', 'thinking');
                const order = addOrder(name, items);
                return order;
            },
            getOrder: (id) => {
                addLog('Order Agent', 'Query', `Checking status for #${id}`, 'success');
                return getOrder(id);
            }
        }
      );

      if (response.toolCalled) {
          addLog('Orchestrator', 'Tool Usage', `Executed tool: ${response.toolCalled}`, 'success');
      }

      const botMsg: ChatMessage = { 
          id: (Date.now() + 1).toString(), 
          role: 'model', 
          content: response.text || "I'm sorry, I couldn't process that.", 
          timestamp: Date.now() 
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error: any) {
      console.error(error);
      addLog('Orchestrator', 'Error', error.message, 'failed');
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', content: "An error occurred connecting to the AI Agents.", timestamp: Date.now() }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-nexus-800 rounded-2xl shadow-2xl border border-nexus-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-nexus-700 bg-nexus-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-nexus-success animate-pulse"></div>
            <h3 className="font-mono font-bold text-nexus-400">NEXUS AI CHAT</h3>
        </div>
        <Cpu size={16} className="text-nexus-500 opacity-50" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[80%] rounded-xl p-3 ${
                msg.role === 'user' 
                ? 'bg-nexus-500 text-white rounded-br-none' 
                : msg.role === 'system'
                ? 'bg-red-900/50 border border-red-500/30 text-red-200'
                : 'bg-nexus-700 text-gray-100 rounded-bl-none'
             }`}>
                <div className="flex items-center gap-2 mb-1 opacity-70 text-xs font-mono">
                    {msg.role === 'user' ? <User size={12}/> : msg.role === 'model' ? <Bot size={12}/> : <AlertCircle size={12}/>}
                    <span>{msg.role === 'user' ? 'YOU' : msg.role === 'model' ? 'NEXUS' : 'SYSTEM'}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
             </div>
          </div>
        ))}
        {isProcessing && (
            <div className="flex justify-start animate-pulse">
                <div className="bg-nexus-700/50 rounded-xl p-3 flex items-center gap-2 text-nexus-400 text-sm">
                    <Sparkles size={14} className="animate-spin" />
                    <span className="font-mono">Agents coordinating...</span>
                </div>
            </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-nexus-900 border-t border-nexus-700">
        <div className="relative">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask for recommendations or place an order..."
                className="w-full bg-nexus-800 text-white border border-nexus-600 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-nexus-400 focus:ring-1 focus:ring-nexus-400 resize-none h-14 text-sm scrollbar-hide"
            />
            <button 
                onClick={handleSend}
                disabled={isProcessing}
                className="absolute right-2 top-2 p-2 bg-nexus-500 hover:bg-nexus-400 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};