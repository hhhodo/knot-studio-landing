import { Link } from 'react-router-dom';

const badges = [
  '소규모 맞춤 수업 (최대 8명)',
  '재료 일체 제공',
  '자격증 취득 지원',
  '초보자 환영',
];

export default function KnotAboutSection() {
  return (
    <section className="py-[100px] bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img
                src="https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/fbc9fe37-dee7-4fc7-b2b7-757cb6d76665_7.png?v=053f2d5279cbe39ed1697e2795f64be5"
                alt="Knot Studio 공방 내부"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <div>
            <h2 className="text-[32px] text-stone-900 mb-3" style={{ fontWeight: 600 }}>
              실 한 올에서 시작되는<br />
              따뜻한 이야기
            </h2>
            <p className="leading-relaxed mb-8" style={{ fontSize: '16px', color: '#767676' }}>
              Knot Studio는 2030년 서울 은평구 응암동에서 시작한 뜨개 전문 공방입니다. 뜨개질이 단순한 취미를 넘어 일상의 위로가 될 수 있다고 믿습니다. 입문자를 위한 원데이클래스부터 전문 강사 자격증 과정까지, 모든 수준의 수강생이 자신만의 속도로 성장할 수 있도록 돕고 있습니다.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="whitespace-nowrap"
                  style={{ fontSize: '14px', fontWeight: 400, color: '#767676', backgroundColor: '#ffffff', padding: '6px 14px', borderRadius: '8px', border: '1px solid #F5F5F5' }}
                >
                  {badge}
                </span>
              ))}
            </div>
            
            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-lg bg-stone-900 text-white text-base font-medium px-[22px] pt-[11.2px] pb-[12.8px] whitespace-nowrap"
            >
              공방 더 알아보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
