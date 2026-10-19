import { createClient } from '@supabase/supabase-js';
import { mockProducts } from '@/mocks/products';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const hasBackend = !!supabaseUrl && !!supabaseKey && !supabaseUrl.includes('placeholder');

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

/* ---------- 로컬 데모 데이터 (Supabase 설정이 없을 때 사용) ---------- */
const demoCategories = [
  { id: 1, name: '실', sort_order: 1 },
  { id: 2, name: '도안', sort_order: 2 },
];

const demoProducts: SupabaseProduct[] = mockProducts.map((m, i) => {
  const cat = demoCategories[m.category === 'yarn' ? 0 : 1];
  const discounted = m.originalPrice != null;
  return {
    id: m.id,
    name: m.name,
    category_id: cat.id,
    product_categories: cat,
    status: 'active',
    description: m.description,
    pricing_mode: 1,
    currency: 'KRW',
    price: discounted ? (m.originalPrice as number) : m.price,
    stock: m.stock,
    discount_enabled: discounted,
    discount_price: discounted ? m.price : null,
    media: [{ url: m.image, type: 'image' }],
    metadata: {
      subCategory: m.subCategory,
      tags: m.tags,
      rating: m.rating,
      reviewCount: m.reviewCount,
      isNew: m.isNew,
      isBest: m.isBest,
    },
    created_at: new Date(2026, 9, 1 + (mockProducts.length - i)).toISOString(),
  } as SupabaseProduct;
});

type Row = Record<string, any>;

class DemoQuery implements PromiseLike<{ data: any; error: any }> {
  private filters: ((r: Row) => boolean)[] = [];
  private sort: { col: string; asc: boolean } | null = null;
  private max = Infinity;
  private mode: 'one' | 'maybe' | null = null;
  private inserted: Row[] | null = null;

  private table: string;
  constructor(table: string) { this.table = table; }

  select() { return this; }
  single() { this.mode = 'one'; return this; }
  eq(col: string, val: unknown) {
    this.filters.push((r) => String(col.includes('->>') ? r[col.split('->>')[0]]?.[col.split('->>')[1]] : r[col]) === String(val));
    return this;
  }
  neq(col: string, val: unknown) { this.filters.push((r) => String(r[col]) !== String(val)); return this; }
  in(col: string, vals: unknown[]) { const set = vals.map(String); this.filters.push((r) => set.includes(String(r[col]))); return this; }
  order(col: string, opts?: { ascending?: boolean }) { this.sort = { col, asc: opts?.ascending !== false }; return this; }
  limit(n: number) { this.max = n; return this; }
  maybeSingle() { this.mode = 'maybe'; return this; }
  insert(payload: Row | Row[]) {
    const rows = Array.isArray(payload) ? payload : [payload];
    this.inserted = rows.map((r, i) => ({ id: `demo-${Date.now()}-${i}`, ...r }));
    return this;
  }
  then<T1 = any, T2 = never>(
    onfulfilled?: ((v: { data: any; error: any }) => T1 | PromiseLike<T1>) | null,
    onrejected?: ((e: any) => T2 | PromiseLike<T2>) | null,
  ): PromiseLike<T1 | T2> {
    return Promise.resolve(this.run()).then(onfulfilled, onrejected);
  }

  private run() {
    if (this.inserted) {
      return { data: this.mode ? this.inserted[0] : this.inserted, error: null };
    }
    let rows: Row[] =
      this.table === 'product_items' ? [...demoProducts] :
      this.table === 'product_categories' ? [...demoCategories] : [];
    rows = rows.filter((r) => this.filters.every((f) => f(r)));
    if (this.sort) {
      const { col, asc } = this.sort;
      rows.sort((a, b) => (a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0) * (asc ? 1 : -1));
    }
    rows = rows.slice(0, this.max);
    return { data: this.mode ? rows[0] ?? null : rows, error: null };
  }
}

const demoClient = { from: (table: string) => new DemoQuery(table) };

export const supabase = (hasBackend ? createClient(supabaseUrl as string, supabaseKey as string) : demoClient) as ReturnType<typeof createClient>;
