export type Role = 'customer' | 'kitchen' | 'admin';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'starter' | 'main' | 'dessert' | 'drink';
  ingredients: string[];
  tags: string[];
  image: string;
  available: boolean;
  calories: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  name: string;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  aiNotes?: string; // Notes from the AI agent
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system' | 'function';
  content: string;
  timestamp: number;
  toolCall?: {
    name: string;
    args: any;
  };
}

export interface AgentLog {
  id: string;
  agentName: string;
  action: string;
  details: string;
  timestamp: number;
  status: 'thinking' | 'success' | 'failed' | 'warning';
}

export interface SystemState {
  menu: MenuItem[];
  orders: Order[];
  logs: AgentLog[];
}