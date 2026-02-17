import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { ChatWidget } from './components/ChatWidget';
import { MenuGrid } from './components/MenuGrid';
import { KitchenDisplay } from './components/KitchenDisplay';
import { AdminDashboard } from './components/AdminDashboard';
import { AgentLogPanel } from './components/AgentLog';
import { LayoutDashboard, UtensilsCrossed, ChefHat, MessageSquare } from 'lucide-react';
import { Role } from './types';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customer' | 'kitchen' | 'admin'>('customer');
  const [showChat, setShowChat] = useState(true);

  return (
    <div className="flex h-screen w-full bg-nexus-900 text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-20 lg:w-64 flex-shrink-0 bg-nexus-800 border-r border-nexus-700 flex flex-col items-center lg:items-stretch py-6">
        <div className="mb-8 px-0 lg:px-6 flex justify-center lg:justify-start">
            <div className="w-10 h-10 bg-gradient-to-br from-nexus-500 to-nexus-accent rounded-lg flex items-center justify-center shadow-lg shadow-nexus-500/20">
                <span className="font-bold text-xl">N</span>
            </div>
            <div className="hidden lg:block ml-3">
                <h1 className="font-bold text-xl tracking-tight">NEXUS</h1>
                <p className="text-xs text-gray-400">Agentic OS</p>
            </div>
        </div>

        <nav className="flex-1 w-full space-y-2 px-2 lg:px-4">
            <button 
                onClick={() => setActiveTab('customer')}
                className={`w-full p-3 rounded-xl flex items-center justify-center lg:justify-start gap-3 transition-all ${activeTab === 'customer' ? 'bg-nexus-700 text-white shadow-inner' : 'text-gray-400 hover:bg-nexus-800 hover:text-gray-200'}`}
            >
                <UtensilsCrossed size={20} />
                <span className="hidden lg:block font-medium">Ordering</span>
            </button>
            <button 
                onClick={() => setActiveTab('kitchen')}
                className={`w-full p-3 rounded-xl flex items-center justify-center lg:justify-start gap-3 transition-all ${activeTab === 'kitchen' ? 'bg-nexus-700 text-white shadow-inner' : 'text-gray-400 hover:bg-nexus-800 hover:text-gray-200'}`}
            >
                <ChefHat size={20} />
                <span className="hidden lg:block font-medium">Kitchen</span>
            </button>
            <button 
                onClick={() => setActiveTab('admin')}
                className={`w-full p-3 rounded-xl flex items-center justify-center lg:justify-start gap-3 transition-all ${activeTab === 'admin' ? 'bg-nexus-700 text-white shadow-inner' : 'text-gray-400 hover:bg-nexus-800 hover:text-gray-200'}`}
            >
                <LayoutDashboard size={20} />
                <span className="hidden lg:block font-medium">Admin</span>
            </button>
        </nav>

        <div className="mt-auto px-4 pb-4 w-full">
            <div className="p-3 bg-nexus-900 rounded-lg border border-nexus-700/50 text-xs text-gray-500 font-mono hidden lg:block">
                <p>STATUS: ONLINE</p>
                <p>LATENCY: 12ms</p>
                <p>AGENTS: 5 ACTIVE</p>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-nexus-800 border-b border-nexus-700 flex items-center justify-between px-6 shrink-0">
             <h2 className="text-lg font-medium text-gray-200">
                {activeTab === 'customer' && 'Customer View'}
                {activeTab === 'kitchen' && 'Kitchen Workflow'}
                {activeTab === 'admin' && 'Admin Dashboard'}
             </h2>
             
             {/* Mobile/Tablet Chat Toggle */}
             {activeTab === 'customer' && (
                 <button 
                    onClick={() => setShowChat(!showChat)}
                    className="p-2 bg-nexus-700 rounded-lg hover:bg-nexus-600 transition-colors lg:hidden"
                 >
                     <MessageSquare size={20} />
                 </button>
             )}
        </header>

        <main className="flex-1 flex overflow-hidden">
            {/* View Content */}
            <div className={`flex-1 h-full overflow-hidden transition-all duration-300 ${showChat && activeTab === 'customer' ? 'hidden md:block' : 'block'}`}>
                {activeTab === 'customer' && <MenuGrid />}
                {activeTab === 'kitchen' && <KitchenDisplay />}
                {activeTab === 'admin' && <AdminDashboard />}
            </div>

            {/* Right Side Panel (Chat or Logs) */}
            {(activeTab === 'customer') && (
                 <div className={`absolute inset-0 z-20 bg-nexus-900 md:static md:w-[400px] border-l border-nexus-700 transition-transform duration-300 ${showChat ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                    <div className="h-full flex flex-col">
                         {/* Close button for mobile */}
                        <button onClick={() => setShowChat(false)} className="md:hidden absolute top-4 right-4 z-30 p-2 bg-nexus-800 rounded-full">
                            ✕
                        </button>
                        <ChatWidget />
                    </div>
                </div>
            )}
            
            {/* System Logs on non-customer screens */}
            {activeTab !== 'customer' && (
                <div className="hidden lg:block w-[300px] border-l border-nexus-700 bg-nexus-900">
                    <AgentLogPanel />
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;