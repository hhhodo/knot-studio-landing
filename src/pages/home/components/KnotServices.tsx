import { Link } from 'react-router-dom';

const services = [
  {
    title: '원데이클래스',
    desc: '뜨개질이 처음이어도 괜찮아요. 2시간 동안 강사와 함께 나만의 첫 작품을 완성해보세요. 재료 준비 없이 오셔도 됩니다.',
    cta: '예약하기',
    path: '/oneday',
    image: 'https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/74e0e4a9-c90f-4f8d-b272-9c41fd7900f4_div.w-full.png?v=85223c16d858b64cd5013d8872772a33',
  },
  {
    title: '정규 강의',
    desc: '입문부터 자격증 과정까지 체계적인 커리큘럼으로 실력을 키워나가세요. 소규모 맞춤 수업으로 운영됩니다.',
    cta: '시간표 보기',
    path: '/classes',
    image: 'https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/f8beadf8-a696-4ae3-85db-21054e991437_div.w-full-1.png?v=b177a309ef91f3f40abdc9355b173a56',
  },
  {
    title: '실 & 도안 샵',
    desc: '엄선된 고품질 실과 전문 도안을 만나보세요. 작품 제작에 필요한 모든 재료를 한 곳에서 만날 수 있습니다.',
    cta: '쇼핑하기',
    path: '/shop',
    image: 'https://storage.readdy-site.link/project_files/bdcd8a41-b885-4724-bbbc-20c1820250ba/1eb4b76b-e528-4b1d-9fa7-4cebdfbb1f7c_div.w-full-2.png?v=506a626ad2377f35e8e0d324447d97bd',
  },
];

export default function KnotServices() {
  return (
    <section className="py-[100px] bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-[32px] text-stone-900" style={{ fontWeight: 600 }}>Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((service) => (
            <div key={service.title} className="group">
              <div className="w-full overflow-hidden rounded-xl mb-4" style={{ aspectRatio: '4/3' }}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="py-4">
                <h3 className="text-[22px] text-stone-900 mb-3" style={{ fontWeight: 500 }}>{service.title}</h3>
                <p className="mb-7 leading-relaxed" style={{ fontSize: '16px', color: '#767676' }}>{service.desc}</p>
                <Link
                  to={service.path}
                  className="inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap group/link"
                  style={{ fontSize: '16px', fontWeight: 500, color: '#1c1917' }}
                >
                  {service.cta}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transition-transform group-hover/link:translate-x-1"
                  >
                    <path
                      d="M13 2.69385L2 13.6938"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3.07129 2.62256H13.0713V12.6226"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}