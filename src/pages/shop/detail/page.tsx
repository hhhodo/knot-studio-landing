import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import KnotNavbar from '@/pages/home/components/KnotNavbar';
import KnotFooter from '@/pages/home/components/KnotFooter';
import { supabase, type SupabaseProduct, getProductImage, getProductFinalPrice, getProductOriginalPrice } from '@/lib/supabase';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<SupabaseProduct | null>(null);
  const [related, setRelated] = useState<SupabaseProduct[]>([]);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const { data } = await supabase
        .from('product_items')
        .select('*, product_categories(id, name, sort_order)')
        .eq('id', id)
        .maybeSingle();
      if (data) {
        const prod = data as SupabaseProduct;
        setProduct(prod);
        // fetch related products in same category
        const { data: rels } = await supabase
          .from('product_items')
          .select('*, product_categories(id, name, sort_order)')
          .eq('status', 'active')
          .eq('category_id', prod.category_id)
          .neq('id', prod.id)
          .limit(4);
        setRelated((rels as SupabaseProduct[]) || []);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-stone-400 text-2xl"></i>
          <p className="text-sm text-stone-400 mt-3">상품을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">상품을 찾을 수 없습니다.</p>
          <Link to="/shop" className="text-stone-600 hover:text-stone-900 underline text-sm">샵으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  const image = getProductImage(product);
  const finalPrice = getProductFinalPrice(product);
  const originalPrice = getProductOriginalPrice(product);
  const meta = product.metadata || {};

  const handleAddToCart = () => {
    const cart: { id: number; qty: number }[] = JSON.parse(localStorage.getItem('knot_cart') || '[]');
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: product.id, qty });
    }
    localStorage.setItem('knot_cart', JSON.stringify(cart));
    setToast('장바구니에 담겼습니다!');
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className="min-h-screen bg-white">
      <KnotNavbar />

      <div className="pt-16 max-w-7xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-8">
          <Link to="/" className="hover:text-stone-600 transition-colors">홈</Link>
          <i className="ri-arrow-right-s-line"></i>
          <Link to="/shop" className="hover:text-stone-600 transition-colors">샵</Link>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-stone-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="w-full rounded-2xl overflow-hidden bg-stone-100" style={{ aspectRatio: '4/3' }}>
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              {meta.isNew && <span className="px-2 py-0.5 bg-stone-900 text-white text-xs rounded-full">NEW</span>}
              {meta.isBest && <span className="px-2 py-0.5 bg-stone-800 text-white text-xs rounded-full">BEST</span>}
              <span className="text-xs text-stone-400">{meta.subCategory}</span>
            </div>

            <h1 className="text-[28px] font-semibold text-stone-900 mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i key={i} className={`text-sm ${i < Math.floor(meta.rating || 0) ? 'ri-star-fill text-stone-700' : 'ri-star-line text-stone-300'}`}></i>
                ))}
              </div>
              <span className="text-sm text-stone-500">{meta.rating ?? 0} ({meta.reviewCount ?? 0}개 리뷰)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-stone-800">{finalPrice.toLocaleString()}원</span>
              {originalPrice != null && (
                <span className="text-lg text-stone-400 line-through">{originalPrice.toLocaleString()}원</span>
              )}
            </div>

            <p className="text-sm text-stone-500 leading-relaxed mb-6">{product.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {(meta.tags || []).map((tag) => (
                <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">#{tag}</span>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-stone-50 rounded-full overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  <i className="ri-subtract-line"></i>
                </button>
                <span className="w-10 text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  <i className="ri-add-line"></i>
                </button>
              </div>
              <span className="text-xs text-stone-400">재고 {product.stock}개</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 bg-stone-900 hover:bg-stone-700 text-white rounded-md font-medium text-[14px] transition-colors cursor-pointer whitespace-nowrap"
              >
                장바구니 담기
              </button>
              <Link
                to="/cart"
                className="flex-1 py-3.5 border border-stone-300 hover:border-stone-400 text-stone-700 rounded-md font-medium text-[14px] transition-colors text-center whitespace-nowrap cursor-pointer"
              >
                바로 구매
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="text-[22px] font-semibold text-stone-900 mb-6">관련 상품</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5" data-product-shop>
              {related.map((p) => {
                const relImage = getProductImage(p);
                const relFinal = getProductFinalPrice(p);
                const relOrig = getProductOriginalPrice(p);
                const relMeta = p.metadata || {};
                return (
                  <Link key={p.id} to={`/shop/${p.id}`} className="group">
                    <div className="w-full rounded-xl overflow-hidden bg-stone-100 mb-3" style={{ aspectRatio: '4/3' }}>
                      <img src={relImage} alt={p.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="text-sm font-medium text-stone-800 mb-1 line-clamp-2">{p.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900">{relFinal.toLocaleString()}원</span>
                      {relOrig != null && (
                        <span className="text-xs text-stone-400 line-through">{relOrig.toLocaleString()}원</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <KnotFooter />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-800 text-white text-sm px-5 py-3 rounded-full">
          <i className="ri-check-line mr-2 text-green-400"></i>
          {toast}
        </div>
      )}
    </div>
  );
}