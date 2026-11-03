export type CustomerMode = 'household' | 'business';
export type CategoryId = 'vegetables' | 'fruits' | 'staples' | 'dairy' | 'herbs';

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  image: string;
  price: number;
  businessPrice: number;
  unit: string;
  businessUnit: string;
  rating: number;
  discount?: number;
  description: string;
  origin: string;
  inStock: boolean;
  featured?: boolean;
};

export type CartLine = { productId: string; quantity: number };
export type Address = { id: string; label: string; detail: string };
export type OrderStatus = 'Confirmed' | 'Packed' | 'Out for delivery' | 'Delivered';
export type Order = {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  itemCount: number;
  address: string;
  slot: string;
};
