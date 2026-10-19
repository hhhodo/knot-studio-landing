# Knot Studio - 뜨개공방 웹사이트

## 1. 프로젝트 설명
뜨개질 공방 "Knot Studio"의 공식 웹사이트. 일일 원데이클래스 체험 예약, 정규 강의 수강신청, 자체 실/도안 판매를 제공하는 복합 서비스 플랫폼.

**타겟 유저**: 뜨개질에 관심 있는 초보자 ~ 중급자, 취미 활동을 찾는 성인
**핵심 가치**: 쉽고 편리한 뜨개 체험 예약 + 온라인 강의 + 재료 구매 원스톱 서비스

## 2. 페이지 구조
- `/` - 홈 (공방 소개, 주요 서비스 안내, CTA)
- `/classes` - 강의 시간표 + 수강신청
- `/oneday` - 원데이클래스 예약
- `/shop` - 실/도안 상품 목록
- `/shop/:id` - 상품 상세
- `/cart` - 장바구니
- `/about` - 공방 소개

## 3. 핵심 기능
- [ ] 홈페이지 (공방 소개, 서비스 하이라이트)
- [ ] 강의 시간표 (카테고리별 필터, 수강신청 폼)
- [ ] 원데이클래스 예약 (날짜 선택, 2시간 단위 09:00~20:00 시간 선택)
- [ ] 실/도안 상품 목록 + 상세 페이지
- [ ] 장바구니 기능 (로컬 스토리지 기반)
- [ ] 결제 페이지 (추후 Stripe 연동 예정)
- [ ] 네비게이션 + 푸터

## 4. 데이터 모델 설계
(현재 Supabase 미연결 - 목업 데이터 사용)

### 강의 데이터
- 강의명, 강사, 개강일, 수업기간, 요일, 수업시간, 강의실, 카테고리

### 원데이클래스 예약
- 날짜, 시간대(09:00~20:00, 2시간 단위), 이름, 연락처, 인원수

### 상품 데이터
- 상품명, 카테고리(실/도안), 가격, 이미지, 설명, 재고

## 5. 백엔드 / 서드파티 연동 상태
- **Supabase**: ✅ 연동 완료 — 제품/카테고리, 주문(헤더/아이템), 예약(appointments) 테이블 활성화
- **Stripe**: 미연동 (추후 상품 결제, 수강료 결제 연동 예정)
- **로컬 스토리지**: 장바구니 항목 임시 저장용으로 유지

### 상품/주문 데이터 (Supabase 연동 완료)
- **product_categories**: id, name, sort_order
- **product_items**: id, name, category_id, status, description, pricing_mode, currency, price, stock, discount_enabled, discount_price, media(JSONB), metadata(JSONB)
- **product_variants**: id, product_id, name, options(JSONB), sort_order
- **product_skus**: id, product_id, label, options(JSONB), price, stock, discount_enabled, discount_price
- **product_custom_fields**: id, name, field_type, options(JSONB), required, sort_order
- **product_custom_values**: id, product_id, field_id, value
- **order_headers**: id, customer_id, status, customer_notes, admin_notes, tracking_number, currency, shipping_total, tax_total, subtotal_items, discount_price, payment_provider, checkout_session_id, payment_id, recipient(JSONB)
- **order_items**: id, order_id, product_id, product_name, sku_id, sku_label, quantity, unit_price, final_price, subtotal

### 예약 데이터 (Supabase 연동 완료)
- **appointments**: id, customer_name, customer_phone, start_time, end_time, notes, program, status, created_at

### 강의 데이터
- 강의명, 강사, 개강일, 수업기간, 요일, 수업시간, 강의실, 카테고리

## 6. 개발 단계 계획

### Phase 1: 홈페이지 + 네비게이션 ✅
- 목표: 공방 분위기를 담은 메인 홈페이지 구축
- 산출물: 홈페이지, 네비게이션, 푸터

### Phase 2: 강의 시간표 + 수강신청
- 목표: 카테고리별 강의 시간표 + 수강신청 폼
- 산출물: /classes 페이지

### Phase 3: 원데이클래스 예약 ✅
- 목표: 날짜/시간 선택 예약 시스템
- 산출물: /oneday 페이지 — Supabase appointments 테이블 연동 완료

### Phase 4: 실/도안 쇼핑몰 ✅
- 목표: 상품 목록, 상세, 장바구니
- 산출물: /shop, /shop/:id, /cart 페이지 — Supabase product_items/product_categories 연동 완료

### Phase 5: 결제/주문 시스템 ✅
- 목표: 주문 데이터를 Supabase order_headers/order_items에 저장
- 산출물: /checkout 페이지 — Supabase 연동 완료