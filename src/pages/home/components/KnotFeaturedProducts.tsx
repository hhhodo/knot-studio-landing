import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type SupabaseProduct, getProductImage, getProductFinalPrice, getProductOriginalPrice } from '@/lib/supabase';

export default function KnotFeaturedProducts() {
  const [featured, setFeatured] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('product_items')
        .select('*, product_categories(id, name, sort_order)')
        .eq('status', 'active')
        .eq('metadata->>isBest', 'true')
        .limit(4);
      setFeatured((data as SupabaseProduct[]) || []);
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-[100px] bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <i className="ri-loader-4-line animate-spin text-stone-400 text-2xl"></i>
        </div>
      </section>
    );
  }

  return (
    <section className="py-[100px] bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-[32px] text-stone-900" style={{ fontWeight: 600 }}>Shop</h2>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            style={{ fontSize: '16px', fontWeight: 500 }}
          >
            전체 보기
            <i className="ri-arrow-right-s-line text-base"></i>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" data-product-shop>
          {featured.map((product) => {
            const image = getProductImage(product);
            const finalPrice = getProductFinalPrice(product);
            const originalPrice = getProductOriginalPrice(product);
            const meta = product.metadata || {};
            return (
              <Link
                key={product.id}
                to={`/shop/${product.id}`}
                className="group cursor-pointer"
              >
                <div className="w-full rounded-xl overflow-hidden bg-stone-100 mb-4" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#a8a29e', marginBottom: '4px' }}>{meta.subCategory}</p>
                  <h3 className="line-clamp-2" style={{ fontSize: '16px', fontWeight: 500, color: '#1c1917', marginBottom: '6px' }}>{product.name}</h3>
                  <div className="flex items-center gap-1" style={{ marginBottom: '6px' }}>
                    <i className="ri-star-fill text-stone-700 text-xs"></i>
                    <span style={{ fontSize: '13px', color: '#a8a29e' }}>{meta.rating ?? 0} ({meta.reviewCount ?? 0})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#1c1917' }}>{finalPrice.toLocaleString()}원</span>
                    {originalPrice != null && (
                      <span style={{ fontSize: '13px', color: '#a8a29e', textDecoration: 'line-through' }}>{originalPrice.toLocaleString()}원</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            전체 상품 보기
            <i className="ri-arrow-right-s-line text-sm"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
