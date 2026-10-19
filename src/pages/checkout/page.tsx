import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: { zonecode: string; roadAddress: string; jibunAddress: string }) => void;
        onclose?: () => void;
        width?: string | number;
        height?: string | number;
      }) => { embed: (el: HTMLElement) => void; open: () => void };
    };
  }
}
import KnotNavbar from '@/pages/home/components/KnotNavbar';
import KnotFooter from '@/pages/home/components/KnotFooter';
import { supabase, type SupabaseProduct, getProductImage, getProductFinalPrice } from '@/lib/supabase';

interface CartItem {
  id: number;
  qty: number;
}

type DeliveryMethod = 'parcel' | 'quick';
type PaymentMethod = 'card' | 'transfer' | 'kakao' | 'naver';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('parcel');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const addressEmbedRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    zipCode: '',
    address: '',
    addressDetail: '',
    memo: '',
    receiverName: '',
    receiverPhone: '',
    sameAsBuyer: true,
  });

  useEffect(() => {
    const checkout = localStorage.getItem('knot_checkout_cart');
    const stored = JSON.parse(checkout || localStorage.getItem('knot_cart') || '[]') as CartItem[];
    setCartItems(stored);
    if (checkout) localStorage.removeItem('knot_checkout_cart');

    const fetchProducts = async () => {
      if (stored.length === 0) {
        setLoadingProducts(false);
        return;
      }
      const ids = stored.map((item) => item.id);
      const { data } = await supabase
        .from('product_items')
        .select('*, product_categories(id, name, sort_order)')
        .in('id', ids)
        .eq('status', 'active');
      setProducts((data as SupabaseProduct[]) || []);
      setLoadingProducts(false);
    };
    fetchProducts();
  }, []);

  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { ...product, qty: item.qty } : null;
    })
    .filter(Boolean) as (SupabaseProduct & { qty: number })[];

  const subtotal = cartProducts.reduce((sum, p) => sum + getProductFinalPrice(p) * p.qty, 0);
  const hasPhysicalItem = cartProducts.some((p) => p.product_categories?.name === '실');
  const isDigitalOnly = cartProducts.length > 0 && !hasPhysicalItem;
  const shipping = isDigitalOnly ? 0 : deliveryMethod === 'quick' ? 6000 : subtotal >= 50000 ? 0 : 3000;
  const total = subtotal + shipping;

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
  };

  useEffect(() => {
    setAgreeAll(agreeTerms && agreePrivacy);
  }, [agreeTerms, agreePrivacy]);

  const handleAddressSearch = useCallback(() => {
    setShowAddressModal(true);
  }, []);

  useEffect(() => {
    if (!showAddressModal || !addressEmbedRef.current) return;
    if (!window.daum || !window.daum.Postcode) return;
    const el = addressEmbedRef.current;
    el.innerHTML = '';
    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm((prev) => ({
          ...prev,
          zipCode: data.zonecode,
          address: data.roadAddress || data.jibunAddress,
        }));
        setShowAddressModal(false);
        setTimeout(() => {
          const input = document.querySelector<HTMLInputElement>('input[name="addressDetail"]');
          if (input) input.focus();
        }, 100);
      },
      onclose: () => setShowAddressModal(false),
      width: '100%',
      height: '100%',
    }).embed(el);
  }, [showAddressModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isAddressValid = isDigitalOnly || (form.zipCode.trim() !== '' && form.address.trim() !== '');
  const isReceiverValid = isDigitalOnly || form.sameAsBuyer || (form.receiverName.trim() !== '' && form.receiverPhone.trim() !== '');
  const canSubmit = agreeTerms && agreePrivacy && isAddressValid && isReceiverValid && cartProducts.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTriedSubmit(true);
    if (!agreeTerms || !agreePrivacy) return;
    if (!isAddressValid) return;
    if (!isReceiverValid) return;

    setSubmitStatus('loading');

    const fullAddress = isDigitalOnly
      ? ''
      : `${form.zipCode} ${form.address} ${form.addressDetail}`.trim();

    const recipient = {
      name: form.sameAsBuyer ? form.name : form.receiverName,
      phone: form.sameAsBuyer ? form.phone : form.receiverPhone,
      email: form.email,
      address: fullAddress,
    };

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('order_headers')
        .insert({
          currency: 'KRW',
          payment_provider: 'bank_transfer',
          status: 'pending_payment',
          customer_notes: form.memo || null,
          recipient,
          subtotal_items: subtotal,
          shipping_total: shipping,
          tax_total: 0,
        })
        .select('id')
        .single();

      if (orderError || !orderData) {
        throw orderError || new Error('Failed to create order');
      }

      const orderId = orderData.id;
      const orderItemsPayload = cartProducts.map((p) => {
        const finalPrice = getProductFinalPrice(p);
        return {
          order_id: orderId,
          product_id: String(p.id),
          product_name: p.name,
          quantity: p.qty,
          unit_price: p.price,
          final_price: finalPrice,
          subtotal: finalPrice * p.qty,
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsError) {
        throw itemsError;
      }

      localStorage.removeItem('knot_cart');
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-white">
        <KnotNavbar />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="max-w-md w-full mx-auto px-6 text-center py-16">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mx-auto mb-6">
              <i className="ri-checkbox-circle-line text-3xl"></i>
            </div>
            <h2 className="text-[24px] font-semibold text-stone-900 mb-2">주문이 완료되었습니다!</h2>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              주문해 주셔서 감사합니다.<br />
              입력하신 이메일로 주문 확인 메일이 발송됩니다.<br />
              <span className="text-stone-400 text-xs">스팸함도 확인해 주세요.</span>
            </p>
            <div className="bg-stone-50 rounded-xl p-4 mb-6 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <i className="ri-mail-line text-stone-400"></i>
                <span>주문 확인 메일 발송 예정</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <i className="ri-smartphone-line text-stone-400"></i>
                <span>배송 출발 시 문자 안내 예정</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <i className="ri-phone-line text-stone-400"></i>
                <span>문의: 02-1234-5678 · 평일 10:00–18:00</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/shop"
                className="flex-1 py-3 border border-stone-300 text-stone-700 rounded-md text-[14px] font-medium hover:bg-stone-50 transition-colors"
              >
                쇼핑 계속하기
              </Link>
              <Link
                to="/"
                className="flex-1 py-3 bg-stone-900 text-white rounded-md text-[14px] font-medium hover:bg-stone-700 transition-colors"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 주소 검색 모달 */}
      {showAddressModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddressModal(false); }}
        >
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-md mx-4 flex flex-col" style={{ height: '520px' }}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100">
              <span className="text-sm font-bold text-stone-800">주소 검색</span>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors cursor-pointer text-stone-400 hover:text-stone-700"
              >
                <i className="ri-close-line text-base"></i>
              </button>
            </div>
            <div ref={addressEmbedRef} className="flex-1 w-full" />
          </div>
        </div>
      )}

      <KnotNavbar />

      <div className="pt-16 max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/cart" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors cursor-pointer">
            <i className="ri-arrow-left-line text-stone-600"></i>
          </Link>
          <h1 className="text-[24px] font-semibold text-stone-900">결제하기</h1>
        </div>

        {loadingProducts ? (
          <div className="text-center py-24">
            <i className="ri-loader-4-line animate-spin text-stone-400 text-2xl"></i>
            <p className="text-sm text-stone-400 mt-3">상품을 불러오는 중...</p>
          </div>
        ) : cartProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-stone-500 mb-6">선택된 상품이 없습니다.</p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-stone-900 text-white hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap rounded-md"
              style={{ height: '50px', paddingLeft: '22px', paddingRight: '22px', fontSize: '16px', fontWeight: 500 }}
            >
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              {/* 주문자 정보 */}
              <section className="bg-stone-50 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-stone-800 mb-4">주문자 정보</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">이름 <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="홍길동"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">연락처 <span className="text-rose-500">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="010-0000-0000"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-stone-500 mb-1.5">이메일 <span className="text-rose-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="hello@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* 배송 정보 */}
              <section className="bg-stone-50 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-stone-800 mb-4">배송 정보</h2>

                {/* 수령인 동일 여부 */}
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    id="sameAsBuyer"
                    checked={form.sameAsBuyer}
                    onChange={(e) => setForm((p) => ({ ...p, sameAsBuyer: e.target.checked }))}
                    className="w-4 h-4 rounded accent-stone-900 cursor-pointer"
                  />
                  <label htmlFor="sameAsBuyer" className="text-xs text-stone-600 cursor-pointer">주문자 정보와 동일</label>
                </div>

                {!form.sameAsBuyer && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-stone-500 mb-1.5">수령인 이름 <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        name="receiverName"
                        value={form.receiverName}
                        onChange={handleChange}
                        required
                        placeholder="홍길동"
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1.5">수령인 연락처 <span className="text-rose-500">*</span></label>
                      <input
                        type="tel"
                        name="receiverPhone"
                        value={form.receiverPhone}
                        onChange={handleChange}
                        required
                        placeholder="010-0000-0000"
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {isDigitalOnly ? (
                  <div className="p-3 bg-stone-100 rounded-lg flex items-center gap-2 mb-2">
                    <i className="ri-map-pin-line text-stone-400 text-sm"></i>
                    <p className="text-xs text-stone-500">도안 상품은 배송 주소가 필요하지 않습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-stone-500 mb-1.5">주소 <span className="text-rose-500">*</span></label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="zipCode"
                        value={form.zipCode}
                        onChange={handleChange}
                        placeholder="우편번호"
                        className={`w-32 px-3.5 py-2.5 bg-white border rounded-lg text-sm text-stone-800 placeholder-stone-300 focus:outline-none transition-colors ${
                          triedSubmit && !isAddressValid && form.zipCode === '' ? 'border-rose-300 focus:border-rose-400' : 'border-stone-200 focus:border-stone-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleAddressSearch}
                        className="px-4 py-2.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-600 hover:bg-stone-100 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        우편번호 찾기
                      </button>
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="기본 주소"
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-stone-800 placeholder-stone-300 focus:outline-none transition-colors ${
                        triedSubmit && !isAddressValid && form.address === '' ? 'border-rose-300 focus:border-rose-400' : 'border-stone-200 focus:border-stone-400'
                      }`}
                    />
                    <input
                      type="text"
                      name="addressDetail"
                      value={form.addressDetail}
                      onChange={handleChange}
                      placeholder="상세 주소 (동, 호수 등)"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                    />
                    {triedSubmit && !isAddressValid && (
                      <p className="text-xs text-rose-500">배송지 주소를 입력해 주세요.</p>
                    )}
                  </div>
                )}

                {/* 배송 방법 */}
                {isDigitalOnly ? (
                  <div className="mt-4 p-3 bg-stone-100 rounded-lg flex items-center gap-2">
                    <i className="ri-download-cloud-line text-stone-500 text-sm"></i>
                    <p className="text-xs text-stone-600">도안 상품은 온라인으로 전달되어 배송비가 없습니다.</p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <label className="block text-xs text-stone-500 mb-2">배송 방법</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'parcel' as DeliveryMethod, label: '택배', desc: subtotal >= 50000 ? '무료' : '3,000원' },
                        { value: 'quick' as DeliveryMethod, label: '퀵배송', desc: '6,000원' },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setDeliveryMethod(opt.value)}
                          className={`flex-1 py-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                            deliveryMethod === opt.value
                              ? 'border-stone-900 bg-stone-900 text-white'
                              : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                          }`}
                        >
                          {opt.label}
                          <span className={`block text-[10px] mt-0.5 font-normal ${deliveryMethod === opt.value ? 'text-white/70' : 'text-stone-400'}`}>
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 배송 메모 */}
                <div className="mt-4">
                  <label className="block text-xs text-stone-500 mb-1.5">배송 메모</label>
                  <textarea
                    name="memo"
                    value={form.memo}
                    onChange={handleChange}
                    placeholder="배송 시 요청사항을 입력해 주세요."
                    maxLength={500}
                    rows={2}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition-colors resize-none"
                  />
                  <p className="text-right text-[10px] text-stone-300 mt-0.5">{form.memo.length}/500</p>
                </div>
              </section>

              {/* 결제 수단 */}
              <section className="bg-stone-50 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-stone-800 mb-4">결제 수단</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: 'card' as PaymentMethod, label: '신용/체크카드', icon: 'ri-bank-card-line' },
                    { value: 'transfer' as PaymentMethod, label: '무통장입금', icon: 'ri-exchange-line' },
                    { value: 'kakao' as PaymentMethod, label: '카카오페이', icon: 'ri-kakao-talk-fill' },
                    { value: 'naver' as PaymentMethod, label: '네이버페이', icon: 'ri-shopping-cart-2-line' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPaymentMethod(opt.value)}
                      className={`py-3 rounded-lg border text-xs font-medium transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        paymentMethod === opt.value
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      <i className={`${opt.icon} text-base`}></i>
                      {opt.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'transfer' && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700 font-medium mb-1">입금 계좌 안내</p>
                    <p className="text-xs text-amber-600">신한은행 110-123-456789 · 예금주: Knot Studio</p>
                    <p className="text-xs text-amber-500 mt-1">※ 3일 내 미입금 시 주문이 자동 취소됩니다.</p>
                  </div>
                )}
              </section>

              {/* 약관 동의 */}
              <section className="bg-stone-50 rounded-2xl p-6">
                <h2 className="text-sm font-bold text-stone-800 mb-4">약관 동의</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeAll}
                      onChange={(e) => handleAgreeAll(e.target.checked)}
                      className="w-4 h-4 rounded accent-stone-900 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-stone-800">전체 동의</span>
                  </label>
                  <div className="h-px bg-stone-200"></div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded accent-stone-900 cursor-pointer"
                    />
                    <span className="text-xs text-stone-600">[필수] 이용약관 동의</span>
                    <a href="#" className="text-xs text-stone-400 underline ml-auto" rel="nofollow">보기</a>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="w-4 h-4 rounded accent-stone-900 cursor-pointer"
                    />
                    <span className="text-xs text-stone-600">[필수] 개인정보 수집 및 이용 동의</span>
                    <a href="#" className="text-xs text-stone-400 underline ml-auto" rel="nofollow">보기</a>
                  </label>
                </div>
              </section>
            </div>

            {/* 우측 주문 요약 */}
            <div className="lg:col-span-1">
              <div className="bg-stone-50 rounded-2xl p-6 sticky top-24">
                <h2 className="text-sm font-bold text-stone-800 mb-4">주문 상품</h2>
                <div className="space-y-3 mb-5">
                  {cartProducts.map((product) => (
                    <div key={product.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-200 flex-shrink-0">
                        <img src={getProductImage(product)} alt={product.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-stone-700 font-medium leading-snug line-clamp-2">{product.name}</p>
                        <p className="text-xs text-stone-400 mt-0.5">수량 {product.qty}개</p>
                      </div>
                      <span className="text-xs font-bold text-stone-800 whitespace-nowrap">
                        {(getProductFinalPrice(product) * product.qty).toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-stone-200 mb-4"></div>

                <div className="space-y-2.5 text-sm mb-5">
                  <div className="flex justify-between text-stone-600">
                    <span>상품 금액</span>
                    <span>{subtotal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>배송비</span>
                    <span>{shipping === 0 ? <span className="text-green-600">무료</span> : `${shipping.toLocaleString()}원`}</span>
                  </div>
                  {isDigitalOnly && (
                    <p className="text-xs text-stone-400">도안은 온라인으로 전달됩니다.</p>
                  )}
                  <div className="h-px bg-stone-200 my-2"></div>
                  <div className="flex justify-between font-bold text-stone-800">
                    <span>총 결제금액</span>
                    <span className="text-base">{total.toLocaleString()}원</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit || submitStatus === 'loading'}
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white rounded-md font-medium text-[14px] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {submitStatus === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-loader-4-line animate-spin"></i>
                      처리 중...
                    </span>
                  ) : (
                    `${total.toLocaleString()}원 결제하기`
                  )}
                </button>

                {triedSubmit && (!agreeTerms || !agreePrivacy) ? (
                  <p className="text-center text-[11px] text-stone-400 mt-2">약관에 동의 후 결제 가능합니다.</p>
                ) : triedSubmit && !isAddressValid ? (
                  <p className="text-center text-[11px] text-rose-400 mt-2">배송지 주소를 입력해 주세요.</p>
                ) : triedSubmit && !isReceiverValid ? (
                  <p className="text-center text-[11px] text-rose-400 mt-2">수령인 정보를 입력해 주세요.</p>
                ) : null}

                {submitStatus === 'error' && (
                  <p className="text-center text-xs text-rose-500 mt-2">
                    오류가 발생했습니다. 다시 시도해 주세요.
                  </p>
                )}
              </div>
            </div>
          </form>
        )}
      </div>

      <KnotFooter />
    </div>
  );
}