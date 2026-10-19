import { Link } from 'react-router-dom';

export default function KnotCTA() {
  return (
    <section className="py-[100px] bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-[32px] text-stone-900 mb-3 leading-snug" style={{ fontWeight: 600 }}>
              첫 번째 코를 잡는 순간,<br />
              새로운 취미가 시작됩니다
            </h2>
            <p className="leading-relaxed mb-8" style={{ fontSize: '16px', color: '#767676' }}>
              원데이클래스로 가볍게 시작해보세요.<br />
              재료 준비 없이 오셔도 됩니다.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link
                to="/oneday"
                className="inline-flex items-center justify-center bg-stone-900 text-white hover:bg-stone-700 transition-colors cursor-pointer whitespace-nowrap rounded-md"
                style={{ height: '50px', paddingLeft: '22px', paddingRight: '22px', fontSize: '16px', fontWeight: 500 }}
              >
                원데이클래스 예약하기
              </Link>
              <Link
                to="/classes"
                className="inline-flex items-center justify-center bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer whitespace-nowrap rounded-md"
                style={{ height: '50px', paddingLeft: '22px', paddingRight: '22px', fontSize: '16px', fontWeight: 500, color: '#3a3a3a' }}
              >
                정규 강의 알아보기
              </Link>
            </div>
          </div>

          <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img
              src="/knot-studio-landing/images/cta002.jpg"
              alt="뜨개질 시작하기"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
