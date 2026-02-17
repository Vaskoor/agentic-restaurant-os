import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Terminal, Activity } from 'lucide-react';

export const AgentLogPanel: React.FC = () => {
  const { state } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.logs]);

  return (
    <div className="h-full bg-nexus-900 border-t border-nexus-700 md:border-t-0 md:border-l flex flex-col">
        <div className="p-3 border-b border-nexus-700 bg-black/20 flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold text-gray-400 flex items-center gap-2">
                <Terminal size={14} /> SYSTEM LOGS
            </h3>
            <Activity size={14} className="text-nexus-success animate-pulse" />
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">
            {state.logs.map((log) => (
                <div key={log.id} className="border-l-2 border-nexus-700 pl-3 py-1 relative animate-fadeIn">
                    <div className={`absolute -left-[9px] top-2 w-4 h-0.5 ${
                        log.status === 'success' ? 'bg-nexus-success' :
                        log.status === 'thinking' ? 'bg-nexus-warning' : 'bg-nexus-danger'
                    }`}></div>
                    <div className="flex justify-between text-gray-500 mb-0.5">
                        <span className="uppercase font-bold text-nexus-400">{log.agentName}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}</span>
                    </div>
                    <p className="text-gray-300 font-bold mb-0.5">{log.action}</p>
                    <p className="text-gray-500 leading-tight">{log.details}</p>
                </div>
            ))}
        </div>
    </div>
  );
};