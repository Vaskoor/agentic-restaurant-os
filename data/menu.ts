import { MenuItem } from '../types';

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 'm1',
    name: 'Nebula Burger',
    description: 'A succulent wagyu beef patty topped with caramelized onion jam, smoked gouda, and truffle aioli on a brioche bun.',
    price: 18.99,
    category: 'main',
    ingredients: ['wagyu beef', 'onion jam', 'smoked gouda', 'truffle aioli', 'brioche bun'],
    tags: ['meat', 'gourmet', 'popular'],
    image: 'https://picsum.photos/400/300?random=1',
    available: true,
    calories: 850
  },
  {
    id: 'm2',
    name: 'Quantum Quinoa Salad',
    description: 'Organic quinoa mixed with roasted beets, kale, walnuts, and a zesty lemon-tahini dressing.',
    price: 14.50,
    category: 'main',
    ingredients: ['quinoa', 'beets', 'kale', 'walnuts', 'lemon', 'tahini'],
    tags: ['vegan', 'gluten-free', 'healthy'],
    image: 'https://picsum.photos/400/300?random=2',
    available: true,
    calories: 420
  },
  {
    id: 'm3',
    name: 'Cyber Spicy Noodles',
    description: 'Hand-pulled noodles tossed in a fiery chili oil sauce with minced pork and bok choy.',
    price: 16.00,
    category: 'main',
    ingredients: ['wheat noodles', 'chili oil', 'pork', 'bok choy', 'garlic'],
    tags: ['spicy', 'comfort-food'],
    image: 'https://picsum.photos/400/300?random=3',
    available: true,
    calories: 680
  },
  {
    id: 'm4',
    name: 'Binary Bites (Truffle Fries)',
    description: 'Crispy shoestring fries tossed with parmesan cheese, parsley, and white truffle oil.',
    price: 8.99,
    category: 'starter',
    ingredients: ['potatoes', 'parmesan', 'truffle oil', 'parsley'],
    tags: ['vegetarian', 'shareable'],
    image: 'https://picsum.photos/400/300?random=4',
    available: true,
    calories: 550
  },
  {
    id: 'm5',
    name: 'Plasma Prawns',
    description: 'Grilled tiger prawns served with a spicy mango salsa and lime wedges.',
    price: 15.99,
    category: 'starter',
    ingredients: ['tiger prawns', 'mango', 'chili', 'lime', 'cilantro'],
    tags: ['seafood', 'gluten-free', 'spicy'],
    image: 'https://picsum.photos/400/300?random=5',
    available: true,
    calories: 320
  },
  {
    id: 'm6',
    name: 'Zero-G Cheesecake',
    description: 'A light and airy japanese-style cheesecake topped with berry compote.',
    price: 9.50,
    category: 'dessert',
    ingredients: ['cream cheese', 'eggs', 'sugar', 'berries'],
    tags: ['sweet', 'vegetarian'],
    image: 'https://picsum.photos/400/300?random=6',
    available: true,
    calories: 400
  },
  {
    id: 'm7',
    name: 'Neural Nectar',
    description: 'A refreshing blend of cucumber, mint, lime, and agave syrup.',
    price: 6.50,
    category: 'drink',
    ingredients: ['cucumber', 'mint', 'lime', 'agave'],
    tags: ['vegan', 'non-alcoholic'],
    image: 'https://picsum.photos/400/300?random=7',
    available: true,
    calories: 120
  }
];