import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem, Order, OrderStatus, AgentLog, SystemState } from '../types';
import { INITIAL_MENU } from '../data/menu';

interface AppContextType {
  state: SystemState;
  addOrder: (customerName: string, items: { id: string; quantity: number; notes?: string }[]) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addLog: (agent: string, action: string, details: string, status?: 'thinking' | 'success' | 'failed' | 'warning') => void;
  toggleItemAvailability: (itemId: string) => void;
  getMenu: () => MenuItem[];
  getOrder: (orderId: string) => Order | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);

  // Initialize with a welcome log
  useEffect(() => {
    addLog('Orchestrator', 'System Init', 'Nexus Agentic OS initialized successfully.', 'success');
  }, []);

  const addLog = (agent: string, action: string, details: string, status: 'thinking' | 'success' | 'failed' | 'warning' = 'thinking') => {
    const newLog: AgentLog = {
      id: Math.random().toString(36).substr(2, 9),
      agentName: agent,
      action,
      details,
      timestamp: Date.now(),
      status
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  const addOrder = (customerName: string, items: { id: string; quantity: number; notes?: string }[]) => {
    const orderItems = items.map(i => {
      const menuItem = menu.find(m => m.id === i.id);
      if (!menuItem) throw new Error(`Item ${i.id} not found`);
      return {
        menuItemId: menuItem.id,
        quantity: i.quantity,
        name: menuItem.name,
        price: menuItem.price,
        notes: i.notes
      };
    });

    const total = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      customerName: customerName || 'Guest',
      items: orderItems,
      total,
      status: 'pending',
      createdAt: Date.now()
    };

    setOrders(prev => [newOrder, ...prev]);
    addLog('Order Agent', 'New Order', `Order #${newOrder.id} received from ${customerName}. Total: $${total.toFixed(2)}`, 'success');
    
    // Simulate Kitchen notification
    setTimeout(() => {
        addLog('Kitchen Agent', 'Notification', `Kitchen alerted for Order #${newOrder.id}`, 'thinking');
    }, 500);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    addLog('Kitchen Agent', 'Status Update', `Order #${orderId} moved to ${status}`, 'success');
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenu(prev => prev.map(m => m.id === itemId ? { ...m, available: !m.available } : m));
    const item = menu.find(m => m.id === itemId);
    addLog('Inventory Agent', 'Stock Update', `${item?.name} is now ${!item?.available ? 'Available' : 'Out of Stock'}`, 'warning');
  };

  const getMenu = () => menu;
  const getOrder = (orderId: string) => orders.find(o => o.id === orderId);

  return (
    <AppContext.Provider value={{
      state: { menu, orders, logs },
      addOrder,
      updateOrderStatus,
      addLog,
      toggleItemAvailability,
      getMenu,
      getOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};