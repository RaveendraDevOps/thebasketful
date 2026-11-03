import { describe, expect, it } from 'vitest';
import { products } from '@/data/catalog';
import { calculateSubtotal, canCheckout, priceFor } from '@/utils/cart';

describe('Basketful cart rules', () => {
  it('calculates household cart totals', () => {
    expect(calculateSubtotal([{ productId: 'tomato', quantity: 2 }, { productId: 'banana', quantity: 1 }], 'household')).toBe(134);
  });

  it('uses mode-specific prices', () => {
    const tomato = products.find((product) => product.id === 'tomato')!;
    expect(priceFor(tomato, 'household')).toBe(38);
    expect(priceFor(tomato, 'business')).toBe(29);
  });

  it('validates all checkout requirements', () => {
    const cart = [{ productId: 'tomato', quantity: 1 }];
    expect(canCheckout(cart, '42 Market Road', '8:00 AM', 'UPI')).toBe(true);
    expect(canCheckout([], '42 Market Road', '8:00 AM', 'UPI')).toBe(false);
    expect(canCheckout(cart, '', '8:00 AM', 'UPI')).toBe(false);
  });
});
