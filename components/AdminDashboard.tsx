import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { state, toggleItemAvailability } = useApp();
  
  // Calculate Analytics
  const totalRevenue = state.orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = state.orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Popular items
  const itemCounts: Record<string, number> = {};
  state.orders.forEach(o => {
      o.items.forEach(i => {
          itemCounts[i.name] = (itemCounts[i.name] || 0) + i.quantity;
      });
  });
  
  const popularData = Object.entries(itemCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="h-full overflow-y-auto p-6 bg-nexus-900/50">
        <h2 className="text-2xl font-bold font-mono text-white mb-6 border-b border-nexus-700 pb-2">Admin Command Center</h2>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 shadow-lg">
                <p className="text-gray-400 text-sm font-mono mb-1">TOTAL REVENUE</p>
                <p className="text-3xl font-bold text-nexus-success">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 shadow-lg">
                <p className="text-gray-400 text-sm font-mono mb-1">TOTAL ORDERS</p>
                <p className="text-3xl font-bold text-nexus-400">{totalOrders}</p>
            </div>
            <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 shadow-lg">
                <p className="text-gray-400 text-sm font-mono mb-1">AVG. ORDER VALUE</p>
                <p className="text-3xl font-bold text-nexus-accent">${avgOrderValue.toFixed(2)}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Charts */}
            <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 shadow-lg h-80">
                <h3 className="text-white font-bold mb-4">Popular Items</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={popularData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => v.length > 10 ? `${v.substr(0,10)}...` : v}/>
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Inventory Management */}
             <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700 shadow-lg overflow-y-auto h-80">
                <h3 className="text-white font-bold mb-4">Inventory Control</h3>
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-nexus-900 text-gray-200 sticky top-0">
                        <tr>
                            <th className="p-2 rounded-tl-lg">Item</th>
                            <th className="p-2">Price</th>
                            <th className="p-2 rounded-tr-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-nexus-700">
                        {state.menu.map(item => (
                            <tr key={item.id} className="hover:bg-nexus-700/50 transition-colors">
                                <td className="p-2 text-white">{item.name}</td>
                                <td className="p-2">${item.price.toFixed(2)}</td>
                                <td className="p-2">
                                    <button 
                                        onClick={() => toggleItemAvailability(item.id)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${item.available ? 'bg-nexus-success/20 text-nexus-success hover:bg-nexus-success/30' : 'bg-nexus-danger/20 text-nexus-danger hover:bg-nexus-danger/30'}`}
                                    >
                                        {item.available ? 'IN STOCK' : 'OUT OF STOCK'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};