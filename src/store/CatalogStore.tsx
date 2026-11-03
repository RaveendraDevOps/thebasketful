import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { categories as fallbackCategories, products as fallbackProducts } from '@/data/catalog';
import { supabase } from '@/lib/supabase';
import { CategoryId, Product } from '@/types';

type Category = (typeof fallbackCategories)[number];
type CatalogStore = {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const CatalogContext = createContext<CatalogStore | null>(null);

export function CatalogStoreProvider({ children }: PropsWithChildren) {
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const [categoryResult, productResult] = await Promise.all([
      supabase.from('categories').select('*').eq('active', true).order('sort_order'),
      supabase.from('products').select('*').eq('active', true).order('name'),
    ]);
    if (categoryResult.error || productResult.error) {
      setError(categoryResult.error?.message ?? productResult.error?.message ?? 'Catalog unavailable');
    } else {
      setCategories((categoryResult.data ?? []).map((item) => ({
        id: item.id as CategoryId,
        name: item.name,
        icon: item.icon,
        color: item.color,
      })));
      setProducts((productResult.data ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category_id as CategoryId,
        image: item.image_url,
        price: item.household_price_paise / 100,
        businessPrice: item.business_price_paise / 100,
        unit: item.household_unit,
        businessUnit: item.business_unit,
        rating: Number(item.rating),
        discount: item.discount_percent ?? undefined,
        description: item.description,
        origin: item.origin,
        inStock: item.stock_quantity > 0,
        featured: item.featured,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { void refresh(); }, 0);
    return () => clearTimeout(timer);
  }, [refresh]);

  const value = useMemo(() => ({ products, categories, loading, error, refresh }), [categories, error, loading, products]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalogStore() {
  const value = useContext(CatalogContext);
  if (!value) throw new Error('useCatalogStore must be used inside CatalogStoreProvider');
  return value;
}
