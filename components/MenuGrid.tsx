import React from 'react';
import { useApp } from '../context/AppContext';

export const MenuGrid: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="h-full overflow-y-auto p-6 bg-nexus-900/50">
      <h2 className="text-2xl font-bold mb-6 font-mono text-white border-b border-nexus-700 pb-2">Menu Inventory</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.menu.map(item => (
          <div key={item.id} className={`group relative bg-nexus-800 border border-nexus-700 rounded-xl overflow-hidden hover:border-nexus-500 transition-all ${!item.available ? 'opacity-60 grayscale' : ''}`}>
            <div className="h-40 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white group-hover:text-nexus-400 transition-colors">{item.name}</h3>
                    <span className="bg-nexus-900 text-nexus-400 px-2 py-1 rounded text-xs font-mono">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-nexus-700 text-gray-300 font-mono">#{tag}</span>
                    ))}
                </div>
            </div>
            {!item.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-4 py-1 font-bold transform -rotate-12 border-2 border-white">SOLD OUT</span>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};