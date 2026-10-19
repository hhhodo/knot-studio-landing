import { Link } from 'react-router-dom';

export default function KnotFooter() {
  return (
    <footer style={{ background: '#FAFAF9' }} className="w-full">
      <div
        style={{ maxWidth: '1440px', padding: '64px 80px 56px' }}
        className="mx-auto max-w-[1440px] px-5 sm:px-10 md:px-20 lg:px-[80px] py-16 pb-14"
      >
        {/* 상단 영역 */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-6">
          {/* 좌측 브랜드 영역 */}
          <div className="flex-shrink-0">
            <h2
              style={{ fontSize: '40px', fontWeight: 700, lineHeight: 1.2, color: '#1C1917' }}
              className="text-[28px] sm:text-[32px] md:text-[40px]"
            >
              Knot Studio
            </h2>
            <p
              style={{ marginTop: '8px', fontSize: '14px', fontWeight: 400, color: '#A8A29E' }}
            >
              뜨개공방
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <a
                href="#"
                style={{ width: '32px', height: '32px', borderRadius: '999px', background: '#E7E5E4' }}
                className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                <i className="ri-instagram-line text-[16px]" style={{ color: '#78716C' }}></i>
              </a>
              <a
                href="#"
                style={{ width: '32px', height: '32px', borderRadius: '999px', background: '#E7E5E4' }}
                className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                <i className="ri-youtube-line text-[16px]" style={{ color: '#78716C' }}></i>
              </a>
              <a
                href="#"
                style={{ width: '32px', height: '32px', borderRadius: '999px', background: '#E7E5E4' }}
                className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                <i className="ri-kakao-talk-fill text-[16px]" style={{ color: '#78716C' }}></i>
              </a>
            </div>
          </div>

          {/* 가운데 공방안내 영역 */}
          <div>
            <h3
              style={{ fontSize: '16px', fontWeight: 700, color: '#292524', marginBottom: '20px' }}
            >
              공방안내
            </h3>
            <div
              style={{ fontSize: '16px', fontWeight: 400, lineHeight: 2.1, color: '#78716C' }}
            >
              <div className="flex items-start gap-2">
                <span className="font-medium whitespace-nowrap">ADDRESS :</span>
                <span>서울시 마포구 연남동 123-45 2층 Knot Studio</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium whitespace-nowrap">TEL :</span>
                <span>02-1234-5678</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium whitespace-nowrap">E-MAIL :</span>
                <span>hello@knotstudio.kr</span>
              </div>
            </div>
          </div>

          {/* 우측 운영시간 영역 */}
          <div>
            <h3
              style={{ fontSize: '16px', fontWeight: 700, color: '#292524', marginBottom: '20px' }}
            >
              운영시간
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '16px', fontWeight: 400, color: '#78716C' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '80px' }}>
                <span>평일</span>
                <span>09:00 - 20:00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '80px' }}>
                <span>토요일</span>
                <span>10:00 - 18:00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '80px' }}>
                <span>일요일</span>
                <span>휴무</span>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 구분선 */}
        <div
          style={{ marginTop: '56px', paddingTop: '28px', borderTop: '1px solid #E7E5E4' }}
        >
          {/* 하단 영역 */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p
              style={{ fontSize: '16px', fontWeight: 400, color: '#A8A29E' }}
            >
              © 2026 Knot Studio. All rights reserved.
            </p>
            <div
              style={{ display: 'flex', gap: '32px', fontSize: '16px', fontWeight: 400, color: '#A8A29E' }}
              className="flex items-center"
            >
              <Link to="/contact" className="hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap">
                개인정보처리방침
              </Link>
              <Link to="/contact" className="hover:opacity-70 transition-opacity cursor-pointer whitespace-nowrap">
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}