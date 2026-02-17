import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, CheckCircle, Flame, AlertOctagon } from 'lucide-react';
import { OrderStatus } from '../types';

const StatusCard: React.FC<{ title: string, count: number, icon: any, color: string }> = ({ title, count, icon: Icon, color }) => (
    <div className={`flex items-center gap-3 p-4 rounded-lg bg-nexus-800 border-l-4 ${color} shadow-lg`}>
        <div className={`p-2 rounded-full bg-nexus-900/50 ${color.replace('border-', 'text-')}`}>
            <Icon size={20} />
        </div>
        <div>
            <p className="text-xs text-gray-400 font-mono uppercase">{title}</p>
            <p className="text-2xl font-bold text-white">{count}</p>
        </div>
    </div>
);

export const KitchenDisplay: React.FC = () => {
  const { state, updateOrderStatus } = useApp();
  
  const pendingOrders = state.orders.filter(o => o.status === 'pending');
  const preparingOrders = state.orders.filter(o => o.status === 'preparing');
  const readyOrders = state.orders.filter(o => o.status === 'ready');

  const handleStatusChange = (orderId: string, currentStatus: OrderStatus) => {
    let next: OrderStatus = 'pending';
    if (currentStatus === 'pending') next = 'preparing';
    else if (currentStatus === 'preparing') next = 'ready';
    else if (currentStatus === 'ready') next = 'delivered';
    
    if (next !== 'pending') updateOrderStatus(orderId, next);
  };

  const OrderCard: React.FC<{ order: any, color: string }> = ({ order, color }) => (
      <div className="bg-nexus-800 rounded-lg p-4 mb-4 border border-nexus-700 shadow-md">
          <div className="flex justify-between items-start mb-3">
              <div>
                  <h4 className="font-bold text-white">#{order.id}</h4>
                  <p className="text-sm text-nexus-400">{order.customerName}</p>
              </div>
              <span className="text-xs font-mono text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</span>
          </div>
          <div className="space-y-2 mb-4">
              {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.quantity}x {item.name}</span>
                      {item.notes && <span className="text-xs text-yellow-500 italic ml-2">({item.notes})</span>}
                  </div>
              ))}
          </div>
          <button 
            onClick={() => handleStatusChange(order.id, order.status)}
            className={`w-full py-2 rounded font-semibold text-sm transition-colors ${color} text-white hover:opacity-90`}
          >
              {order.status === 'pending' ? 'Start Cooking' : order.status === 'preparing' ? 'Mark Ready' : 'Complete Delivery'}
          </button>
      </div>
  );

  return (
    <div className="h-full overflow-hidden flex flex-col p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-mono text-white">Kitchen Display System</h2>
            <div className="flex gap-4">
                <StatusCard title="Pending" count={pendingOrders.length} icon={AlertOctagon} color="border-red-500" />
                <StatusCard title="Cooking" count={preparingOrders.length} icon={Flame} color="border-yellow-500" />
                <StatusCard title="Ready" count={readyOrders.length} icon={CheckCircle} color="border-green-500" />
            </div>
        </div>

        <div className="flex-1 overflow-hidden grid grid-cols-3 gap-6">
            {/* Pending Column */}
            <div className="bg-nexus-900/50 rounded-xl p-4 flex flex-col">
                <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><AlertOctagon size={16}/> PENDING</h3>
                <div className="flex-1 overflow-y-auto pr-2">
                    {pendingOrders.map(o => <OrderCard key={o.id} order={o} color="bg-red-600" />)}
                    {pendingOrders.length === 0 && <p className="text-gray-600 text-center mt-10 italic">No pending orders</p>}
                </div>
            </div>

            {/* Cooking Column */}
            <div className="bg-nexus-900/50 rounded-xl p-4 flex flex-col">
                <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2"><Flame size={16}/> PREPARING</h3>
                <div className="flex-1 overflow-y-auto pr-2">
                    {preparingOrders.map(o => <OrderCard key={o.id} order={o} color="bg-yellow-600" />)}
                </div>
            </div>

            {/* Ready Column */}
            <div className="bg-nexus-900/50 rounded-xl p-4 flex flex-col">
                <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2"><CheckCircle size={16}/> READY</h3>
                <div className="flex-1 overflow-y-auto pr-2">
                    {readyOrders.map(o => <OrderCard key={o.id} order={o} color="bg-green-600" />)}
                </div>
            </div>
        </div>
    </div>
  );
};