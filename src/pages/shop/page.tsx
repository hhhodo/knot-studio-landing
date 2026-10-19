import { useState, useEffect } from 'react';
import KnotNavbar from '@/pages/home/components/KnotNavbar';
import KnotFooter from '@/pages/home/components/KnotFooter';
import ProductCard from './components/ProductCard';
import { supabase, type SupabaseProduct } from '@/lib/supabase';

interface ProductCategory {
  id: number;
  name: string;
  sort_order: number;
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [toast, setToast] = useState('');
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: cats } = await supabase
        .from('product_categories')
        .select('*')
        .order('sort_order');
      setCategories(cats || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase
        .from('product_items')
        .select('*, product_categories(id, name, sort_order)')
        .eq('status', 'active');

      if (activeCategory !== 'all') {
        const catId = categories.find((c) => String(c.id) === activeCategory)?.id;
        if (catId) query = query.eq('category_id', catId);
      }

      const { data: prods } = await query.order('created_at', { ascending: false });
      setProducts((prods as SupabaseProduct[]) || []);
      setLoading(false);
    };
    fetchProducts();
  }, [activeCategory, categories]);

  const categoryTabs = [{ id: 'all', label: '전체' }, ...categories.map((c) => ({ id: String(c.id), label: c.name }))];

  const handleAddToCart = (product: SupabaseProduct) => {
    const cart: { id: number; qty: number }[] = JSON.parse(localStorage.getItem('knot_cart') || '[]');
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: product.id, qty: 1 });
    }
    localStorage.setItem('knot_cart', JSON.stringify(cart));
    setToast(`"${product.name}" 장바구니에 담겼습니다!`);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="min-h-screen bg-white">
      <KnotNavbar />

      <div className="pt-16">
        {/* 헤더 배너 */}
        <div className="bg-stone-900 py-16 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/knot-studio-landing/images/shopbg001.jpg"
              alt=""
              className="w-full h-full object-cover object-top opacity-15"
            />
          </div>
          <div className="relative z-10">
            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Shop</p>
            <h1 className="text-white mb-3" style={{ fontSize: '32px', fontWeight: 600 }}>실 &amp; 도안 샵</h1>
            <p className="max-w-md mx-auto leading-relaxed" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)' }}>
              엄선된 고품질 실과 전문 도안을 만나보세요.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-[100px]">
          {/* 상단 섹션 타이틀 + 필터 */}
          <div className="mb-12">
            <div className="mb-8">
              <h2 className="text-stone-900" style={{ fontSize: '32px', fontWeight: 600 }}>Shop</h2>
            </div>

            {/* KnotServices 스타일 탭 버튼 */}
            <div className="flex items-center gap-2 flex-wrap">
              {categoryTabs.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`transition-colors cursor-pointer whitespace-nowrap rounded-md ${
                    activeCategory === cat.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 hover:bg-stone-200'
                  }`}
                  style={{
                    height: '40px',
                    paddingLeft: '18px',
                    paddingRight: '18px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: activeCategory === cat.id ? '#fff' : '#3a3a3a',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <i className="ri-loader-4-line animate-spin text-stone-400 text-2xl"></i>
              <p className="text-sm text-stone-400 mt-3">상품을 불러오는 중...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6" data-product-shop>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <KnotFooter />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-800 text-white px-5 py-3 rounded-full" style={{ fontSize: '14px' }}>
          <i className="ri-check-line mr-2 text-green-400"></i>
          {toast}
        </div>
      )}
    </div>
  );
}