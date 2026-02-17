import { GoogleGenAI, FunctionDeclaration, Type, Tool } from "@google/genai";
import { MenuItem, Order } from '../types';

// We will inject the app functions dynamically when calling the service
// to avoid circular dependencies with the Context.

const toolsDefinition: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'getMenu',
        description: 'Get the full restaurant menu with details including ingredients, price, and availability.',
      },
      {
        name: 'recommendDish',
        description: 'Find dishes based on dietary preferences (vegan, spicy, etc) or ingredients.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                query: { type: Type.STRING, description: "The dietary preference or ingredient to search for (e.g., 'vegan', 'spicy', 'chicken')" }
            },
            required: ['query']
        }
      },
      {
        name: 'placeOrder',
        description: 'Place a new order for the customer. Returns the order ID.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                customerName: { type: Type.STRING, description: "Name of the customer" },
                items: {
                    type: Type.ARRAY,
                    description: "List of items to order",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            menuItemId: { type: Type.STRING, description: "The ID of the menu item (e.g., 'm1', 'm2')" },
                            quantity: { type: Type.NUMBER, description: "Quantity of the item" },
                            notes: { type: Type.STRING, description: "Special instructions for this item" }
                        },
                        required: ['menuItemId', 'quantity']
                    }
                }
            },
            required: ['customerName', 'items']
        }
      },
      {
        name: 'checkOrderStatus',
        description: 'Check the status of an existing order using the Order ID.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                orderId: { type: Type.STRING, description: "The unique Order ID" }
            },
            required: ['orderId']
        }
      }
    ]
  }
];

export class AgentService {
  private ai: GoogleGenAI;
  private modelName = 'gemini-3-flash-preview';
  private systemInstruction = `
    You are 'Nexus', an advanced Agentic Restaurant OS. 
    You act as the Orchestrator Agent. 
    Your goal is to help customers order food, answer questions about the menu, and manage the dining experience.
    
    You have access to specialized agents (tools):
    - Menu Agent: via getMenu() and recommendDish()
    - Order Agent: via placeOrder() and checkOrderStatus()
    
    Tone: Professional, efficient, slightly futuristic, and friendly.
    
    IMPORTANT RULES:
    1. ALWAYS check the menu using getMenu() before answering specific questions about ingredients or prices if you don't know.
    2. When a user wants to order, CONFIRM the items before calling placeOrder().
    3. If a user asks for 'something spicy', use recommendDish('spicy').
    4. Keep responses concise unless asked for details.
    5. If a tool fails, apologize and ask for clarification.
    6. When you place an order, tell the user the Order ID clearly.
  `;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async sendMessage(
    history: any[], 
    message: string, 
    functions: { 
      getMenu: () => MenuItem[], 
      placeOrder: (name: string, items: any[]) => Order,
      getOrder: (id: string) => Order | undefined
    }
  ) {
    const model = this.ai.models;
    
    // Construct the chat session manually or use generateContent for single-turn with history
    // For Agentic behavior, we often want single-turn with full context to manage state better, 
    // but the Chat API is convenient. Let's use Chat API.

    // Map history to Gemini format
    const chatHistory = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
    }));

    const chat = this.ai.chats.create({
      model: this.modelName,
      config: {
        systemInstruction: this.systemInstruction,
        tools: toolsDefinition,
      },
      history: chatHistory
    });

    let result = await chat.sendMessage({ message });
    let response = result.text;
    
    // Handle Tool Calls Loop
    // The SDK handles the loop if we use the proper pattern, but doing it manually gives us more control over the "Agent UI" updates.
    // However, for this demo, we'll manually check for function calls in the response candidates if the SDK doesn't auto-resolve (it doesn't auto-resolve logic, we must run it).
    
    const candidates = result.candidates;
    if (!candidates || candidates.length === 0) return { text: "System Error: No response." };
    
    const part = candidates[0].content.parts[0];
    
    // Check for tool call
    if (part.functionCall) {
        const fc = part.functionCall;
        const name = fc.name;
        const args = fc.args as any;

        let functionResult;
        
        try {
            if (name === 'getMenu') {
                functionResult = functions.getMenu();
            } else if (name === 'recommendDish') {
                const query = args.query.toLowerCase();
                const menu = functions.getMenu();
                functionResult = menu.filter(item => 
                    item.name.toLowerCase().includes(query) || 
                    item.description.toLowerCase().includes(query) ||
                    item.tags.some(t => t.includes(query))
                );
            } else if (name === 'placeOrder') {
                // Validate items exist
                const menu = functions.getMenu();
                // Simple validation logic
                functionResult = functions.placeOrder(args.customerName, args.items);
            } else if (name === 'checkOrderStatus') {
                const order = functions.getOrder(args.orderId);
                functionResult = order ? { status: order.status, total: order.total } : { error: "Order not found" };
            }
        } catch (e: any) {
            functionResult = { error: e.message };
        }

        // Send function response back to model
        const toolResponse = await chat.sendMessage({
             parts: [
                {
                    functionResponse: {
                        name: name,
                        response: { result: functionResult }
                    }
                }
             ]
        });

        return { 
            text: toolResponse.text, 
            toolCalled: name,
            toolResult: functionResult 
        };
    }

    return { text: response };
  }
}