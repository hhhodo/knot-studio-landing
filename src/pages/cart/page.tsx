import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KnotNavbar from '@/pages/home/components/KnotNavbar';
import KnotFooter from '@/pages/home/components/KnotFooter';
import { supabase, type SupabaseProduct, getProductImage, getProductFinalPrice } from '@/lib/supabase';

interface CartItem {
  id: number;
  qty: number;
}

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('knot_cart') || '[]') as CartItem[];
    setCartItems(stored);
    setSelectedIds(new Set(stored.map((i) => i.id)));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (cartItems.length === 0) {
        setLoading(false);
        return;
      }
      const ids = cartItems.map((item) => item.id);
      const { data } = await supabase
        .from('product_items')
        .select('*, product_categories(id, name, sort_order)')
        .in('id', ids)
        .eq('status', 'active');
      setProducts((data as SupabaseProduct[]) || []);
      setLoading(false);
    };
    fetchProducts();
  }, [cartItems]);

  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { ...product, qty: item.qty } : null;
    })
    .filter(Boolean) as (SupabaseProduct & { qty: number })[];

  const allChecked = cartProducts.length > 0 && cartProducts.every((p) => selectedIds.has(p.id));

  const toggleAll = () => {
    if (allChecked) setSelectedIds(new Set());
    else setSelectedIds(new Set(cartProducts.map((p) => p.id)));
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const updateQty = (id: number, qty: number) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, qty) } : item
    );
    setCartItems(updated);
    localStorage.setItem('knot_cart', JSON.stringify(updated));
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('knot_cart', JSON.stringify(updated));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const removeSelected = () => {
    const updated = cartItems.filter((item) => !selectedIds.has(item.id));
    setCartItems(updated);
    localStorage.setItem('knot_cart', JSON.stringify(updated));
    setSelectedIds(new Set());
  };

  const selectedProducts = cartProducts.filter((p) => selectedIds.has(p.id));
  const subtotal = selectedProducts.reduce((sum, p) => sum + getProductFinalPrice(p) * p.qty, 0);
  const hasPhysicalItem = selectedProducts.some((p) => p.product_categories?.name === '실');
  const isDigitalOnly = selectedProducts.length > 0 && !hasPhysicalItem;
  const shipping = selectedProducts.length === 0 ? 0 : isDigitalOnly ? 0 : subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    const selectedCart = cartItems.filter((item) => selectedIds.has(item.id));
    localStorage.setItem('knot_checkout_cart', JSON.stringify(selectedCart));
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      <KnotNavbar />

      <div className="pt-16 max-w-7xl mx-auto px-6 py-[80px]">
        <h1 className="text-stone-900 mb-10" style={{ fontSize: '32px', fontWeight: 600 }}>장바구니</h1>

        {loading ? (
          <div className="text-center py-24">
            <i className="ri-loader-4-line animate-spin text-stone-400 text-2xl"></i>
            <p className="text-sm text-stone-400 mt-3">상품을 불러오는 중...</p>
          </div>
        ) : cartProducts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-stone-100 text-stone-400 mx-auto mb-5">
              <i className="ri-shopping-bag-line text-2xl"></i>
            </div>
            <p className="text-stone-500 mb-8" style={{ fontSize: '16px', color: '#767676' }}>장바구니가 비어있습니다.</p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-stone-900 text-white hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap rounded-md"
              style={{ height: '50px', paddingLeft: '22px', paddingRight: '22px', fontSize: '16px', fontWeight: 500 }}
            >
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* 전체 선택 바 */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-stone-50 rounded-xl mb-3">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded accent-stone-900 cursor-pointer"
                  />
                  <span className="text-stone-700" style={{ fontSize: '14px', fontWeight: 500 }}>
                    전체 선택
                    <span className="text-stone-400 font-normal ml-1">({selectedIds.size}/{cartProducts.length})</span>
                  </span>
                </label>
                {selectedIds.size > 0 && (
                  <button
                    onClick={removeSelected}
                    className="text-stone-400 hover:text-rose-500 transition-colors cursor-pointer whitespace-nowrap"
                    style={{ fontSize: '13px' }}
                  >
                    선택 삭제
                  </button>
                )}
              </div>

              {/* 상품 목록 */}
              <div className="space-y-3">
                {cartProducts.map((product) => {
                  const checked = selectedIds.has(product.id);
                  const image = getProductImage(product);
                  const finalPrice = getProductFinalPrice(product);
                  const meta = product.metadata || {};
                  return (
                    <div
                      key={product.id}
                      className={`flex gap-4 p-4 rounded-xl transition-colors ${checked ? 'bg-stone-50' : 'bg-stone-50/40 opacity-60'}`}
                    >
                      <div className="flex items-center flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOne(product.id)}
                          className="w-4 h-4 rounded accent-stone-900 cursor-pointer"
                        />
                      </div>
                      <Link to={`/shop/${product.id}`} className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                        <img src={image} alt={product.name} className="w-full h-full object-cover object-top" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/shop/${product.id}`}>
                          <h3 className="text-stone-800 hover:text-stone-600 transition-colors line-clamp-2 mb-1" style={{ fontSize: '14px', fontWeight: 500 }}>
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-stone-400 mb-3" style={{ fontSize: '13px' }}>{meta.subCategory}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-stone-100 rounded-full overflow-hidden">
                            <button
                              onClick={() => updateQty(product.id, product.qty - 1)}
                              className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer"
                            >
                              <i className="ri-subtract-line text-xs"></i>
                            </button>
                            <span className="w-8 text-center" style={{ fontSize: '14px' }}>{product.qty}</span>
                            <button
                              onClick={() => updateQty(product.id, product.qty + 1)}
                              className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-200 cursor-pointer"
                            >
                              <i className="ri-add-line text-xs"></i>
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-stone-800" style={{ fontSize: '15px', fontWeight: 600 }}>
                              {(finalPrice * product.qty).toLocaleString()}원
                            </span>
                            <button
                              onClick={() => removeItem(product.id)}
                              className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                            >
                              <i className="ri-delete-bin-line text-sm"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <div className="bg-stone-50 rounded-2xl p-6 sticky top-24">
                <h2 className="text-stone-800 mb-6" style={{ fontSize: '18px', fontWeight: 600 }}>주문 요약</h2>

                {selectedProducts.length === 0 ? (
                  <p className="text-stone-400 text-center py-4" style={{ fontSize: '14px' }}>상품을 선택해 주세요.</p>
                ) : (
                  <>
                    <p className="text-stone-500 mb-4" style={{ fontSize: '13px' }}>
                      선택된 상품 <span className="text-stone-800" style={{ fontWeight: 600 }}>{selectedProducts.length}종</span>
                    </p>
                    <div className="space-y-3 mb-6" style={{ fontSize: '14px' }}>
                      <div className="flex justify-between text-stone-600">
                        <span>상품 금액</span>
                        <span>{subtotal.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>배송비</span>
                        <span>
                          {shipping === 0
                            ? <span className="text-green-600">무료</span>
                            : `${shipping.toLocaleString()}원`}
                        </span>
                      </div>
                      {isDigitalOnly ? (
                        <p className="text-stone-400" style={{ fontSize: '12px' }}>도안은 온라인으로 전달됩니다.</p>
                      ) : shipping > 0 ? (
                        <p className="text-stone-400" style={{ fontSize: '12px' }}>5만원 이상 구매 시 무료배송</p>
                      ) : null}
                      <div className="bg-stone-200 h-px my-1"></div>
                      <div className="flex justify-between text-stone-900" style={{ fontWeight: 700 }}>
                        <span>총 결제금액</span>
                        <span>{total.toLocaleString()}원</span>
                      </div>
                    </div>
                  </>
                )}

                {/* KnotCTA 스타일 버튼 */}
                <button
                  onClick={handleCheckout}
                  disabled={selectedProducts.length === 0}
                  className="w-full inline-flex items-center justify-center bg-stone-900 hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white transition-colors cursor-pointer whitespace-nowrap rounded-md"
                  style={{ height: '50px', fontSize: '16px', fontWeight: 500 }}
                >
                  {selectedProducts.length === cartProducts.length
                    ? '전체 구매하기'
                    : selectedProducts.length > 0
                      ? `선택 구매하기 (${selectedProducts.length}종)`
                      : '상품을 선택해 주세요'}
                </button>

                {/* Secondary 버튼 — KnotCTA bg-stone-100 스타일 */}
                <Link
                  to="/shop"
                  className="mt-3 w-full inline-flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer whitespace-nowrap rounded-md"
                  style={{ height: '50px', fontSize: '16px', fontWeight: 500 }}
                >
                  쇼핑 계속하기
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <KnotFooter />
    </div>
  );
}