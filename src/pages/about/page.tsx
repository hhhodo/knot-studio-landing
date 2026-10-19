import { Link } from 'react-router-dom';
import KnotNavbar from '@/pages/home/components/KnotNavbar';
import KnotFooter from '@/pages/home/components/KnotFooter';

const instructors = [
  {
    name: '박민정',
    role: '대표 강사 / 공방 대표',
    career: 'TKCA 1급 강사 · 뜨개 경력 15년',
    image: 'https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/20bb3be2-b9c3-42f1-b818-edb7d8db3258_51.png?v=8210188d2644c95650dc34b2f02b54dd',
    desc: '뜨개질의 매력에 빠져 15년간 작품 활동과 강의를 병행해왔습니다. 수강생 한 명 한 명의 성장을 가장 큰 보람으로 여깁니다.',
  },
  {
    name: '김수연',
    role: '대바늘 전문 강사',
    career: 'TKCA 1급 강사 · 뜨개 경력 10년',
    image: 'https://readdy.ai/api/search-image?query=friendly%20korean%20woman%20craft%20instructor%20portrait%2C%20warm%20natural%20light%2C%20knitting%20studio%20background%2C%20approachable%20smile&width=400&height=450&seq=inst002&orientation=portrait',
    desc: '대바늘의 섬세한 매력을 전달하는 것이 목표입니다. 초보자도 쉽게 따라올 수 있는 친절한 수업을 진행합니다.',
  },
  {
    name: '이지은',
    role: '코바늘 전문 강사',
    career: 'TKCA 2급 강사 · 뜨개 경력 8년',
    image: 'https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/b2f91579-aa0e-4d9a-8130-5c87c820ca65_53.png?v=590e2a2375454cee52dbcd6cb27e16e0',
    desc: '코바늘로 만들 수 있는 무한한 가능성을 함께 탐구합니다. 아미구루미부터 패션 아이템까지 다양하게 가르칩니다.',
  },
  {
    name: '최하늘',
    role: '소품 & 인형 전문 강사',
    career: 'TKCA 2급 강사 · 뜨개 경력 6년',
    image: 'https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/7962dd95-59bf-45f0-89f7-6884063995fb_54.png?v=d7ec12150b33a9d640d6814247a0fecc',
    desc: '귀여운 소품과 인형 제작을 전문으로 합니다. 선물용 작품 만들기를 좋아하는 분들께 특히 추천드립니다.',
  },
];

const badges = [
  '소규모 맞춤 수업 (최대 8명)',
  '재료 일체 제공',
  '자격증 취득 지원',
  '초보자 환영',
];

const stats = [
  { num: '500+', label: '누적 수강생' },
  { num: '7년', label: '운영 경력' },
  { num: '4명', label: '전문 강사진' },
  { num: '12개', label: '강의 과정' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <KnotNavbar />

      <div className="pt-16">
        {/* 헤더 배너 */}
        <div className="bg-stone-900 py-16 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/0fd94f71-c10f-4bfd-9bd2-d9b3df879538_34.png?v=fed45157aa214067c11d0384384a28ce"
              alt=""
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="relative z-10">
            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">About Us</p>
            <h1 className="text-white mb-3" style={{ fontSize: '32px', fontWeight: 600 }}>Knot Studio</h1>
            <p className="max-w-md mx-auto leading-relaxed" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)' }}>
              서울 마포구 연남동의 작은 뜨개 공방
            </p>
          </div>
        </div>

        {/* 스토리 섹션 */}
        <section className="py-[100px] bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
              <div>
                <h2 className="text-stone-900 mb-3 leading-snug" style={{ fontSize: '32px', fontWeight: 600 }}>
                  실 한 올에서 시작되는<br />
                  따뜻한 이야기
                </h2>
                <div className="space-y-4 mb-8 leading-relaxed" style={{ fontSize: '16px', color: '#767676' }}>
                  <p>
                    Knot Studio는 2019년 박민정 대표가 연남동의 작은 공간에서 시작한 뜨개 전문 공방입니다.
                    "뜨개질이 단순한 취미를 넘어 일상의 위로가 될 수 있다"는 믿음으로 문을 열었습니다.
                  </p>
                  <p>
                    처음에는 소규모 원데이클래스로 시작했지만, 수강생들의 뜨거운 반응에 힘입어
                    정규 강의, 자격증 과정, 그리고 자체 실과 도안 판매까지 서비스를 확장했습니다.
                  </p>
                  <p>
                    현재는 4명의 전문 강사진과 함께 매달 100명 이상의 수강생이 Knot Studio에서
                    뜨개질의 즐거움을 발견하고 있습니다.
                  </p>
                </div>

                {/* 뱃지 — 메인페이지와 동일 */}
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
                  to="/oneday"
                  className="inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap group/link"
                  style={{ fontSize: '16px', fontWeight: 500, color: '#1c1917' }}
                >
                  원데이클래스 체험하기
                  <i className="ri-arrow-right-line text-sm transition-transform group-hover/link:translate-x-1"></i>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src="https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/d859b7f0-b519-4832-8207-fa30065c9c18_55.png?v=fa82e01f81148f7e38f3950c87c2735a"
                    alt=""
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="w-full rounded-xl overflow-hidden mt-6" style={{ aspectRatio: '4/3' }}>
                  <img
                    src="https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/0a9d707e-edb6-42d8-a6e3-3c900e413bea_56.png?v=e7d214111d9ed281d8d6b4f2516063a1"
                    alt=""
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="w-full rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src="https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/68ea71aa-95a4-41d5-afa9-50de40070002_57.png?v=60c12f40aaf765d0d3149398937807ec"
                    alt=""
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="w-full rounded-xl overflow-hidden mt-6" style={{ aspectRatio: '4/3' }}>
                  <img
                    src="https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/83efd2da-a81d-4333-9d40-a4678232486f_58.png?v=eb6c4914357e7754044548978e483dad"
                    alt=""
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 통계 섹션 */}
        <section className="py-[60px] bg-stone-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center bg-white rounded-xl p-7">
                  <div className="text-stone-900 mb-2" style={{ fontSize: '32px', fontWeight: 700 }}>{stat.num}</div>
                  <div className="text-stone-500" style={{ fontSize: '14px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 강사 소개 섹션 */}
        <section className="py-[100px] bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-stone-900" style={{ fontSize: '32px', fontWeight: 600 }}>Instructors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {instructors.map((inst) => (
                <div key={inst.name} className="group">
                  <div className="w-full overflow-hidden rounded-xl mb-4" style={{ aspectRatio: '4/5' }}>
                    <img
                      src={inst.image}
                      alt={inst.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="py-3">
                    <h3 className="text-stone-900 mb-1" style={{ fontSize: '18px', fontWeight: 500 }}>{inst.name}</h3>
                    <p className="mb-1" style={{ fontSize: '13px', color: '#a8a29e' }}>{inst.role}</p>
                    <p className="mb-3" style={{ fontSize: '12px', color: '#d6d3d1' }}>{inst.career}</p>
                    <p className="leading-relaxed" style={{ fontSize: '14px', color: '#767676' }}>{inst.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 오시는 길 + 지도 */}
        <section className="py-[100px] bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-stretch">
              <div>
                <h2 className="text-stone-900 mb-3 leading-snug" style={{ fontSize: '32px', fontWeight: 600 }}>
                  찾아오시는 길
                </h2>
                <p className="mb-8 leading-relaxed" style={{ fontSize: '16px', color: '#767676' }}>
                  서울 마포구 연남동에 위치한 Knot Studio에서<br />
                  직접 만나뵙겠습니다.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    { icon: 'ri-map-pin-line', label: '주소', value: '서울시 마포구 연남동 123-45, 2층' },
                    { icon: 'ri-phone-line', label: '전화', value: '02-1234-5678' },
                    { icon: 'ri-mail-line', label: '이메일', value: 'hello@knotstudio.kr' },
                    { icon: 'ri-subway-line', label: '지하철', value: '홍대입구역 3번 출구 도보 10분' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 text-stone-600 flex-shrink-0">
                        <i className={`${item.icon} text-base`}></i>
                      </div>
                      <div>
                        <p className="text-stone-400 mb-0.5" style={{ fontSize: '12px' }}>{item.label}</p>
                        <p className="text-stone-700" style={{ fontSize: '14px', fontWeight: 500 }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-stone-50 rounded-xl p-5 space-y-3">
                  <p className="text-stone-700 mb-2" style={{ fontSize: '14px', fontWeight: 600 }}>운영 시간</p>
                  {[
                    { day: '평일 (월~금)', time: '09:00 – 20:00' },
                    { day: '토요일', time: '10:00 – 18:00' },
                    { day: '일요일 / 공휴일', time: '휴무' },
                  ].map((row) => (
                    <div key={row.day} className="flex justify-between" style={{ fontSize: '14px' }}>
                      <span className="text-stone-600">{row.day}</span>
                      <span className={row.time === '휴무' ? 'text-stone-400' : 'text-stone-700 font-medium'}>{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 우측 지도 */}
              <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.9273726790523!2d126.9225!3d37.5635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c98fa5e5e5e5e%3A0x5e5e5e5e5e5e5e5e!2z7ISc7Jq47Yq567OE7Iuc!5e0!3m2!1sko!2skr!4v1719999999999!5m2!1sko!2skr"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '100%' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Knot Studio 위치"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section
  className="flex flex-col justify-center items-start w-full"
  style={{
    margin: '0 auto',
    minHeight: '380px',
    padding: '80px 16px',

    backgroundImage: "url('https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/3039f807-4444-4df5-8111-6f475edc228c_60.png?v=6ee720473a4dd98556af49b5496bdf04')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  <div className="w-full max-w-7xl mx-auto text-center">
    <h2
      className="mb-3 leading-snug"
      style={{
        fontSize: '32px',
        fontWeight: 600,
        color: '#1C1917',
      }}
    >
      함께 뜨개질을 시작해요
    </h2>

    <p
      className="mb-8 leading-relaxed"
      style={{
        fontSize: '16px',
        color: '#555555',
      }}
    >
      원데이클래스로 부담 없이 체험해보세요.
    </p>

    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <Link
        to="/oneday"
        className="inline-flex items-center justify-center bg-black transition-colors cursor-pointer whitespace-nowrap rounded-md"
        style={{
          height: '50px',
          paddingLeft: '22px',
          paddingRight: '22px',
          fontSize: '16px',
          fontWeight: 500,
          color: '#ffffff',
        }}
      >
        원데이클래스 예약하기
      </Link>

      <Link
        to="/classes"
        className="inline-flex items-center justify-center bg-white transition-colors cursor-pointer whitespace-nowrap rounded-md"
        style={{
          height: '50px',
          paddingLeft: '22px',
          paddingRight: '22px',
          fontSize: '16px',
          fontWeight: 500,
          color: '#3A3A3A',
        }}
      >
        강의 시간표 보기
      </Link>
    </div>
  </div>
</section>
      </div>

      <KnotFooter />
    </div>
  );
}