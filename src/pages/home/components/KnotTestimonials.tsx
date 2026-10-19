import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: '김지현',
    role: '원데이클래스 수강생',
    avatar: '/knot-studio-landing/images/avatar001.jpg',
    image: '/knot-studio-landing/images/15.png',
    content: '6개월 동안 스웨터 완성했어요! 처음엔 막막했는데 단계별로 차근차근 알려주셔서 정말 도움이 많이 됐습니다. 혼자 했다면 절대 완성하지 못했을 것 같아요. 막힐때마다 친절하게 도와주시니 작품이 성공적으로 나올 수 있었습니다.',
    rating: 5,
    class: '대바늘 뜨개 체험',
  },
  {
    id: 2,
    name: '박서연',
    role: '대바늘 중급 수강생',
    avatar: '/knot-studio-landing/images/avatar002.jpg',
    image: '/knot-studio-landing/images/review002.jpg',
    content: '6개월 동안 스웨터 완성했어요! 처음엔 막막했는데 단계별로 차근차근 알려주셔서 정말 도움이 많이 됐습니다.',
    rating: 5,
    class: '대바늘 중급',
  },
  {
    id: 3,
    name: '이민아',
    role: '자격증 과정 수강생',
    avatar: '/knot-studio-landing/images/avatar003.jpg',
    image: '/knot-studio-landing/images/review003.jpg',
    content: 'TKCA 자격증 취득 후 저도 강사로 활동하고 있어요. Knot Studio 덕분에 새로운 커리어를 시작할 수 있었습니다.',
    rating: 5,
    class: '자격증 과정',
  },
];

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10.0001 15.6391L4.11673 18.8755L5.4334 12.3864L0.483398 7.90784L7.1834 7.12326L10.0001 1.12456L12.8167 7.12326L19.5167 7.90784L14.5667 12.3864L15.8834 18.8755L10.0001 15.6391Z" fill="#44403C" />
  </svg>
);

export default function KnotTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  };

  const next = () => {
    setCurrentIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));
  };

  const t = testimonials[currentIndex];

  return (
    <section style={{ padding: '100px 0', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.1,
              color: '#1C1917',
              margin: 0,
            }}
          >
            Reviews
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={prev}
              style={{
                width: 36,
                height: 36,
                border: '1px solid #E7E5E4',
                borderRadius: 999,
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
              aria-label="이전 리뷰"
            >
              <i className="ri-arrow-left-line" style={{ fontSize: 18, color: '#44403C' }}></i>
            </button>
            <button
              onClick={next}
              style={{
                width: 36,
                height: 36,
                border: '1px solid #E7E5E4',
                borderRadius: 999,
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
              }}
              aria-label="다음 리뷰"
            >
              <i className="ri-arrow-right-line" style={{ fontSize: 18, color: '#44403C' }}></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 56,
          }}
          className="flex-col lg:flex-row"
        >
          {/* 좌측: 리뷰 이미지 */}
          <div
            style={{
              width: 612,
              height: 458,
              borderRadius: 16,
              overflow: 'hidden',
              flexShrink: 0,
            }}
            className="w-full lg:w-[612px] h-auto lg:h-[458px]"
          >
            <img
              src={t.image}
              alt={`${t.name}의 작품`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>

          {/* 우측: 텍스트 영역 */}
          <div
            style={{
              width: 588,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: 458,
            }}
            className="w-full lg:w-[588px] min-h-auto lg:min-h-[458px]"
          >
            <div>
              <h3
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  letterSpacing: '-1px',
                  color: '#1C1917',
                  maxWidth: 520,
                  margin: 0,
                }}
              >
                {t.class} 수강 후기
              </h3>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: 1.7,
                  letterSpacing: '-0.28px',
                  color: '#78716C',
                  maxWidth: 620,
                  marginTop: 24,
                  marginBottom: 0,
                }}
              >
                {t.content}
              </p>
            </div>

            {/* 하단 작성자 정보 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 16,
                marginTop: 'auto',
                background: '#F5F5F4',
                borderRadius: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 54, height: 54, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <StarIcon />
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      lineHeight: '24px',
                      letterSpacing: '-0.28px',
                      color: '#1C1917',
                      margin: 0,
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: '20.8px',
                      letterSpacing: '-0.28px',
                      color: '#A8A29E',
                      margin: 0,
                    }}
                  >
                    {t.class}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}