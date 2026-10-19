import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface SupabaseProduct {
  id: number;
  name: string;
  category_id: number;
  product_categories?: { id: number; name: string; sort_order: number } | null;
  status: string;
  description: string;
  pricing_mode: number;
  currency: string;
  price: number;
  stock: number;
  discount_enabled: boolean;
  discount_price: number | null;
  media: { url: string; type: string }[];
  metadata: {
    subCategory?: string;
    tags?: string[];
    rating?: number;
    reviewCount?: number;
    isNew?: boolean;
    isBest?: boolean;
  };
}

export interface CartItem {
  id: number;
  qty: number;
}

export function getProductImage(product: SupabaseProduct): string {
  if (Array.isArray(product.media) && product.media.length > 0) {
    return product.media[0].url;
  }
  return '';
}

export function getProductFinalPrice(product: SupabaseProduct): number {
  if (product.discount_enabled && product.discount_price != null) {
    return product.discount_price;
  }
  return product.price;
}

export function getProductOriginalPrice(product: SupabaseProduct): number | undefined {
  if (product.discount_enabled && product.discount_price != null) {
    return product.price;
  }
  return undefined;
}