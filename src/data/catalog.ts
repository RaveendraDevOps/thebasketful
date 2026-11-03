import { Address, CategoryId, Order, Product } from '@/types';

export const categories: { id: CategoryId; name: string; icon: string; color: string }[] = [
  { id: 'vegetables', name: 'Vegetables', icon: 'leaf-outline', color: '#DDF2E2' },
  { id: 'fruits', name: 'Fruits', icon: 'nutrition-outline', color: '#FFF0D3' },
  { id: 'staples', name: 'Staples', icon: 'basket-outline', color: '#F5E7D7' },
  { id: 'dairy', name: 'Dairy', icon: 'water-outline', color: '#E4F2FA' },
  { id: 'herbs', name: 'Herbs', icon: 'flower-outline', color: '#E8F4D9' },
];

export const products: Product[] = [
  { id: 'tomato', name: 'Farm Fresh Tomatoes', category: 'vegetables', image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=800', price: 38, businessPrice: 29, unit: '1 kg', businessUnit: '10 kg crate', rating: 4.8, discount: 18, description: 'Juicy, naturally ripened tomatoes sourced directly from partner farms.', origin: 'Kolar, Karnataka', inStock: true, featured: true },
  { id: 'onion', name: 'Premium Red Onions', category: 'vegetables', image: 'https://images.unsplash.com/photo-1518977956815-dee00671e1a8?w=800', price: 42, businessPrice: 32, unit: '1 kg', businessUnit: '25 kg sack', rating: 4.7, discount: 12, description: 'Firm, flavourful red onions with excellent shelf life.', origin: 'Nashik, Maharashtra', inStock: true, featured: true },
  { id: 'potato', name: 'Jyoti Potatoes', category: 'vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800', price: 34, businessPrice: 25, unit: '1 kg', businessUnit: '30 kg sack', rating: 4.6, description: 'Clean, evenly sized all-purpose potatoes for everyday cooking.', origin: 'Agra, Uttar Pradesh', inStock: true },
  { id: 'banana', name: 'Robusta Bananas', category: 'fruits', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800', price: 58, businessPrice: 44, unit: '1 dozen', businessUnit: '12 dozen crate', rating: 4.9, discount: 8, description: 'Naturally sweet bananas picked at just the right maturity.', origin: 'Yelakki, Karnataka', inStock: true, featured: true },
  { id: 'apple', name: 'Royal Gala Apples', category: 'fruits', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800', price: 189, businessPrice: 154, unit: '1 kg', businessUnit: '18 kg box', rating: 4.7, discount: 15, description: 'Crisp and aromatic apples with a balanced sweet flavour.', origin: 'Himachal Pradesh', inStock: true },
  { id: 'mango', name: 'Alphonso Mangoes', category: 'fruits', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800', price: 349, businessPrice: 285, unit: '6 pcs', businessUnit: '4 dozen box', rating: 4.9, discount: 10, description: 'Rich, fragrant Alphonso mangoes from the Konkan coast.', origin: 'Ratnagiri, Maharashtra', inStock: true, featured: true },
  { id: 'rice', name: 'Sona Masoori Rice', category: 'staples', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800', price: 349, businessPrice: 1260, unit: '5 kg', businessUnit: '25 kg bag', rating: 4.5, description: 'Lightweight, aromatic everyday rice with consistent grain quality.', origin: 'Raichur, Karnataka', inStock: true },
  { id: 'milk', name: 'Fresh Cow Milk', category: 'dairy', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800', price: 32, businessPrice: 55, unit: '500 ml', businessUnit: '1 L × 12', rating: 4.8, description: 'Pasteurised fresh cow milk delivered under a cold chain.', origin: 'Bengaluru Rural', inStock: true },
  { id: 'coriander', name: 'Fresh Coriander', category: 'herbs', image: 'https://images.unsplash.com/photo-1588879460618-9249e7d947d1?w=800', price: 18, businessPrice: 120, unit: '1 bunch', businessUnit: '10 bunches', rating: 4.6, description: 'Freshly harvested aromatic coriander, cleaned and sorted.', origin: 'Hosur, Tamil Nadu', inStock: true },
  { id: 'spinach', name: 'Tender Spinach', category: 'herbs', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800', price: 26, businessPrice: 180, unit: '250 g', businessUnit: '3 kg crate', rating: 4.5, description: 'Tender green spinach leaves, freshly harvested this morning.', origin: 'Hosur, Tamil Nadu', inStock: false },
];

export const addresses: Address[] = [
  { id: 'home', label: 'Home', detail: '42, 7th Cross, Indiranagar, Bengaluru 560038' },
  { id: 'store', label: 'My Store', detail: '18, Market Road, Koramangala, Bengaluru 560095' },
];

export const initialOrders: Order[] = [
  { id: 'BF240819', date: '28 Oct 2026', total: 1284, status: 'Out for delivery', itemCount: 8, address: addresses[1].detail, slot: '2:00 PM – 4:00 PM' },
  { id: 'BF239742', date: '21 Oct 2026', total: 746, status: 'Delivered', itemCount: 5, address: addresses[0].detail, slot: '8:00 AM – 10:00 AM' },
];

export const slots = ['8:00 AM – 10:00 AM', '10:00 AM – 12:00 PM', '2:00 PM – 4:00 PM', '5:00 PM – 7:00 PM'];
