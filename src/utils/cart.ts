import { products } from '@/data/catalog';
import { CartLine, CustomerMode, Product } from '@/types';

export const priceFor = (product: Product, mode: CustomerMode) =>
  mode === 'business' ? product.businessPrice : product.price;

export const calculateSubtotal = (cart: CartLine[], mode: CustomerMode, catalog: Product[] = products) =>
  cart.reduce((sum, line) => {
    const product = catalog.find((item) => item.id === line.productId);
    return sum + (product ? priceFor(product, mode) * line.quantity : 0);
  }, 0);

export const canCheckout = (cart: CartLine[], address: string, slot: string, payment: string) =>
  cart.length > 0 && Boolean(address && slot && payment);
